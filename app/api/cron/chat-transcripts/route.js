import { selectRows, updateRow, sendEmail } from '@/lib/db';
import { chatTranscriptEmail } from '@/lib/transcript';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const QUIET_MINUTES = 15; // a chat counts as finished after this long with no new message
const MIN_VISITOR_MESSAGES = 2; // skip chats where the visitor only said "hi"

// Called by Vercel Cron every 10 minutes (see vercel.json). Emails Manny each finished chat once,
// and again with only the new messages if the visitor comes back later.
export async function GET(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!to) return Response.json({ ok: false, error: 'LEAD_NOTIFY_EMAIL not set' }, { status: 500 });

  const quietBefore = new Date(Date.now() - QUIET_MINUTES * 60_000).toISOString();
  const lookback = new Date(Date.now() - 7 * 24 * 3600_000).toISOString();
  const rows = await selectRows('chats', `select=id,session_id,page,messages,updated_at,emailed_msg_count&updated_at=lt.${encodeURIComponent(quietBefore)}&updated_at=gt.${encodeURIComponent(lookback)}&order=updated_at.asc&limit=50`);

  let sent = 0, skipped = 0;
  for (const chat of rows) {
    const msgs = Array.isArray(chat.messages) ? chat.messages : [];
    const already = chat.emailed_msg_count || 0;
    const newVisitorMsgs = msgs.slice(already).filter((m) => m.role === 'user').length;
    const totalVisitorMsgs = msgs.filter((m) => m.role === 'user').length;
    if (msgs.length <= already || newVisitorMsgs === 0) continue;
    if (totalVisitorMsgs < MIN_VISITOR_MESSAGES) { skipped++; continue; }

    const ok = await sendEmail({ to, ...chatTranscriptEmail(chat, already) });
    if (ok) {
      await updateRow('chats', chat.id, { emailed_msg_count: msgs.length, emailed_at: new Date().toISOString() });
      sent++;
    }
  }
  return Response.json({ ok: true, checked: rows.length, sent, skipped });
}
