import { insertRow, rateLimited, clientIp } from '@/lib/db';
import { SITE, PRICES } from '@/lib/site';

export const runtime = 'nodejs';
export const maxDuration = 30;

const SYSTEM = `You are the AI assistant on the Tampa Website Services website. Tampa Website Services builds websites with AI built in for local businesses, from Ybor City in Tampa, Florida. The founder is Manny Potter, who has built Tampa websites for over fifteen years.

How you talk: friendly, plain, short. Two to four sentences. No jargon, no em dashes, no hype. You are an AI assistant, and you say so if asked. Never claim to be Manny or a human.

What we sell:
- Starter Website, starting at $${PRICES.starter.toLocaleString()}: up to 5 pages, mobile-friendly, contact forms, basic SEO, SSL.
- Growth Website, starting at $${PRICES.growth.toLocaleString()}: fully custom, local SEO, CRM and call tracking, advanced lead capture, blog.
- AI Growth System, starting at $${PRICES.ai.toLocaleString()}: custom site plus AI concierge chat, missed-call text-back, automated email and SMS follow-up, booking, CRM automation.
- Monthly plans: Website Care from $97/mo, SEO and Content Growth from $497/mo, Ads Growth Plan from $997/mo.
- Industries: HVAC, plumbing, roofing, electricians, pest control, lawn care, med spas, local small businesses, and Florida government (built to WCAG 2.2 AA accessibility).

Rules:
- Prices are starting points. A final price comes from a short call and a written quote. Never promise a final price, a timeline, or search rankings.
- Never give legal, medical, tax or electrical safety advice beyond telling someone in danger to call 911.
- If someone wants a quote, wants to talk, or is ready to start, invite them to book a call: ${SITE.bookingUrl} or call ${SITE.phone}.
- Suggest the free AI audit for anyone curious about their current site: /website-audit-review-request
- Don't ask for sensitive personal information. If you don't know something, say so and offer the call.`;

const FALLBACK = `Thanks for asking! I'm the Tampa Website Services AI assistant, and I'm getting set up. Websites start at $${PRICES.starter.toLocaleString()}, and our AI Growth System starts at $${PRICES.ai.toLocaleString()}. The fastest way to get a real answer is a quick call with Manny: ${SITE.bookingUrl}`;

export async function POST(req) {
  if (rateLimited(clientIp(req), 15)) return Response.json({ reply: 'Give me a second, that was a lot of messages at once. Try again in a minute.' }, { status: 429 });
  let body;
  try { body = await req.json(); } catch { return Response.json({ reply: 'Something went wrong. Try again?' }, { status: 400 }); }

  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
  while (messages.length && messages[0].role !== 'user') messages.shift();
  if (!messages.length) return Response.json({ reply: 'Ask me anything about a website for your business.' });

  const sessionId = String(body.sessionId || '').slice(0, 64) || 'anon';
  const key = process.env.ANTHROPIC_API_KEY;
  let reply = FALLBACK;

  if (key) {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5', max_tokens: 400, system: SYSTEM, messages }),
      });
      if (r.ok) {
        const j = await r.json();
        const text = (j.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n').trim();
        if (text) reply = text;
      } else {
        console.error('[chat] model error', r.status, await r.text());
      }
    } catch (e) {
      console.error('[chat] request failed', e);
    }
  }

  await insertRow('chats', { session_id: sessionId, page: String(body.page || '').slice(0, 300), messages: [...messages, { role: 'assistant', content: reply }] });
  return Response.json({ reply });
}
