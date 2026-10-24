import { SMS_CONSENT_TEXT as SMS_TEXT } from '@/lib/consent';
import { insertRow, notifyLead, rateLimited, clientIp } from '@/lib/db';

export const runtime = 'nodejs';

const clean = (v, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req) {
  if (rateLimited(clientIp(req), 5)) return Response.json({ ok: false, error: 'Too many requests. Try again in a minute.' }, { status: 429 });
  let body;
  try { body = await req.json(); } catch { return Response.json({ ok: false, error: 'Bad request' }, { status: 400 }); }
  if (body.company_website) return Response.json({ ok: true }); // honeypot

  const source = ['contact', 'audit', 'chat', 'pricing'].includes(body.source) ? body.source : 'contact';
  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 40);
  const message = clean(body.message, 4000);
  if (!email && !phone) return Response.json({ ok: false, error: 'Please add an email or phone number.' }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ ok: false, error: 'That email looks off.' }, { status: 400 });

  const row = {
    source, name, email, phone, message,
    website: clean(body.website, 300),
    sms_consent: body.sms_consent === true,
    sms_consent_text: body.sms_consent === true ? SMS_TEXT : null,
    page: clean(body.page, 300),
    meta: typeof body.meta === 'object' && body.meta ? body.meta : {},
  };
  const res = await insertRow('leads', row);
  await notifyLead(`New ${source} lead: ${name || email || phone}`, JSON.stringify(row, null, 2));
  return Response.json({ ok: true, stored: res.stored });
}
