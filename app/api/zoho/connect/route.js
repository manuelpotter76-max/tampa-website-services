import { connectWithGrantCode, checkBrandField, zohoConfigured, BRAND_VALUE } from '@/lib/zoho';
import { rateLimited, clientIp } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// One-time setup: trade the Zoho grant code for a saved connection, then check the Brand field.
// Protected by the same CRON_SECRET Manny already has in Vercel.
export async function POST(req) {
  if (rateLimited(clientIp(req), 5)) return Response.json({ ok: false, error: 'Too many tries. Wait a minute.' }, { status: 429 });
  const { key, code } = await req.json().catch(() => ({}));
  if (!process.env.CRON_SECRET || key !== process.env.CRON_SECRET) return Response.json({ ok: false, error: 'Wrong setup password.' }, { status: 401 });
  if (!zohoConfigured()) return Response.json({ ok: false, error: 'ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET are not set in Vercel yet (or the site needs a redeploy).' }, { status: 400 });
  if (code) {
    const c = await connectWithGrantCode(String(code).trim());
    if (!c.ok) return Response.json({ ok: false, error: `Zoho didn't accept the code: ${c.error}. Codes expire after a few minutes, so generate a fresh one and try again.` }, { status: 400 });
  }
  const brand = await checkBrandField();
  return Response.json({ ok: true, connected: true, brand, brandValue: BRAND_VALUE });
}
