import crypto from 'node:crypto';
import { insertRow, selectRows, sendEmail } from '@/lib/db';
import { SITE, MISSED_CALL_TEXT } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Zoom Phone webhook. Subscribed event: phone.callee_missed.
// Emails Manny the caller's number plus a ready-to-copy text, and saves the call as a lead.
const hmac = (secret, data) => crypto.createHmac('sha256', secret).update(data).digest('hex');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function pretty(num) {
  const d = String(num || '').replace(/\D/g, '');
  const ten = d.length === 11 && d.startsWith('1') ? d.slice(1) : d;
  return ten.length === 10 ? `${ten.slice(0, 3)}-${ten.slice(3, 6)}-${ten.slice(6)}` : String(num || '');
}

export async function POST(req) {
  const secret = process.env.ZOOM_WEBHOOK_SECRET;
  if (!secret) return Response.json({ error: 'ZOOM_WEBHOOK_SECRET not set' }, { status: 500 });

  const raw = await req.text();
  let body;
  try { body = JSON.parse(raw); } catch { return Response.json({ error: 'Bad request' }, { status: 400 }); }

  // Zoom checks the URL when the app is set up.
  if (body.event === 'endpoint.url_validation') {
    const plainToken = String(body.payload?.plainToken || '');
    return Response.json({ plainToken, encryptedToken: hmac(secret, plainToken) });
  }

  // Every other event must be signed by Zoom with our secret.
  const ts = req.headers.get('x-zm-request-timestamp') || '';
  const sig = req.headers.get('x-zm-signature') || '';
  const expected = 'v0=' + hmac(secret, `v0:${ts}:${raw}`);
  const fresh = Math.abs(Date.now() / 1000 - Number(ts)) < 300;
  const ok = sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  if (!ok || !fresh) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  if (body.event !== 'phone.callee_missed') return Response.json({ ok: true, ignored: body.event });

  const o = body.payload?.object || {};
  const caller = o.caller || {};
  const number = caller.phone_number || caller.number || '';
  const name = caller.name || caller.user_name || caller.display_name || '';
  const callId = String(o.call_id || o.id || `${number}-${o.date_time || o.ringing_start_time || ''}`);
  const when = new Date(o.date_time || o.ringing_start_time || body.event_ts || Date.now());

  // Zoom sometimes sends the same event more than once. Only alert once per call.
  const seen = await selectRows('leads', `select=id&source=eq.call&meta->>call_id=eq.${encodeURIComponent(callId)}&limit=1`);
  if (seen.length) return Response.json({ ok: true, duplicate: true });

  const shown = pretty(number) || 'Unknown number';
  const blocked = !String(number).replace(/\D/g, '');
  await insertRow('leads', { source: 'call', name, email: '', phone: blocked ? '' : shown, message: 'Missed call', page: 'Zoom Phone', meta: { call_id: callId, at: when.toISOString(), raw_number: number } });

  const whenText = when.toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const subject = `Missed call: ${shown}${name ? ` (${name})` : ''}`;
  const text = [
    `Missed call from ${shown}${name ? ` (${name})` : ''}`,
    whenText,
    '',
    blocked ? 'The caller hid their number, so there is no one to text back.' : 'Copy this and text it to them:',
    '',
    blocked ? '' : MISSED_CALL_TEXT,
    '',
    blocked ? '' : `Their number: ${shown}`,
  ].join('\n');
  const html = `<!doctype html><html><body style="margin:0;background:#F1F5F9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:14px;overflow:hidden">
<tr><td style="background:#0B1020;padding:16px 24px;color:#F5F7FA;font-size:15px;font-weight:600">Missed call</td></tr>
<tr><td style="padding:24px">
<div style="font-size:28px;font-weight:700;color:#0B1020;letter-spacing:-.01em">${esc(shown)}</div>
${name ? `<div style="font-size:15px;color:#475569;margin-top:2px">${esc(name)}</div>` : ''}
<div style="font-size:14px;color:#64748B;margin-top:6px">${esc(whenText)}</div>
${blocked ? '<p style="margin:20px 0 0;color:#334155">The caller hid their number, so there is no one to text back.</p>' : `
<p style="margin:22px 0 8px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#7C3AED">Copy and text this to them</p>
<div style="background:#EDE9FE;color:#1E1B4B;border-radius:10px;padding:14px 16px;font-size:16px;line-height:1.5">${esc(MISSED_CALL_TEXT)}</div>
<p style="margin:16px 0 0;font-size:14px;color:#475569">Their number: <strong style="color:#0B1020">${esc(shown)}</strong></p>`}
</td></tr>
<tr><td style="padding:14px 24px;background:#F8FAFC;color:#64748B;font-size:12px">Saved to your leads. ${esc(SITE.name)}.</td></tr>
</table></td></tr></table></body></html>`;

  await sendEmail({ to: process.env.LEAD_NOTIFY_EMAIL, subject, text, html });
  return Response.json({ ok: true });
}
