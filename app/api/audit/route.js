import dns from 'node:dns/promises';
import net from 'node:net';
import { insertRow, rateLimited, clientIp } from '@/lib/db';

export const runtime = 'nodejs';
export const maxDuration = 60;

function isPrivate(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
  }
  const v = ip.toLowerCase();
  return v === '::1' || v === '::' || v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe80') || v.startsWith('::ffff:127.') || v.startsWith('::ffff:10.') || v.startsWith('::ffff:192.168.');
}

async function normalize(raw) {
  let s = String(raw || '').trim();
  if (!s) throw new Error('Enter your website address.');
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  let u;
  try { u = new URL(s); } catch { throw new Error('That doesn\'t look like a website address.'); }
  if (!['http:', 'https:'].includes(u.protocol)) throw new Error('Use a regular web address.');
  if (!u.hostname.includes('.') || u.hostname.endsWith('.local') || u.hostname === 'localhost') throw new Error('Use a public website address.');
  const addrs = await dns.lookup(u.hostname, { all: true }).catch(() => []);
  if (!addrs.length) throw new Error('We couldn\'t find that website. Check the spelling?');
  if (addrs.some((a) => isPrivate(a.address))) throw new Error('Use a public website address.');
  u.hash = '';
  return u.toString();
}

async function timed(url, ms, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { ...opts, signal: ctrl.signal, cache: 'no-store' }); } finally { clearTimeout(t); }
}

async function pagespeed(url) {
  const qs = new URLSearchParams({ url, strategy: 'mobile' });
  ['performance', 'seo', 'accessibility', 'best-practices'].forEach((c) => qs.append('category', c));
  if (process.env.PAGESPEED_API_KEY) qs.set('key', process.env.PAGESPEED_API_KEY);
  try {
    const r = await timed('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?' + qs, 50_000);
    if (!r.ok) { console.error('PageSpeed failed', r.status, process.env.PAGESPEED_API_KEY ? 'with key' : 'no key'); return null; }
    const j = await r.json();
    const cat = j.lighthouseResult?.categories || {};
    const a = j.lighthouseResult?.audits || {};
    const pct = (x) => (typeof x?.score === 'number' ? Math.round(x.score * 100) : null);
    return {
      performance: pct(cat.performance), seo: pct(cat.seo), accessibility: pct(cat.accessibility), bestPractices: pct(cat['best-practices']),
      lcp: a['largest-contentful-paint']?.displayValue || null,
      cls: a['cumulative-layout-shift']?.displayValue || null,
      tbt: a['total-blocking-time']?.displayValue || null,
    };
  } catch { return null; }
}

const decode = (t) => t.replace(/&amp;/g, '&').replace(/&#0?39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/\s+/g, ' ');

async function inspect(url) {
  const out = { https: url.startsWith('https://'), reachable: false };
  try {
    const r = await timed(url, 10_000, { headers: { 'User-Agent': 'TWS-Audit/1.0 (+https://www.tampawebsiteservices.com)' }, redirect: 'follow' });
    out.reachable = r.ok;
    out.finalHttps = r.url.startsWith('https://');
    const html = (await r.text()).slice(0, 600_000);
    const low = html.toLowerCase();
    const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]?.trim() || '';
    out.title = decode(title).slice(0, 120);
    out.hasMetaDescription = /<meta[^>]+name=["']description["'][^>]*content=["'][^"']{20,}/i.test(html);
    out.hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
    out.h1Count = (html.match(/<h1[\s>]/gi) || []).length;
    out.hasTel = /href=["']tel:/i.test(html);
    out.hasForm = /<form[\s>]/i.test(html);
    out.hasSchema = /application\/ld\+json/i.test(html);
    out.hasLocalSchema = /"@type"\s*:\s*"(LocalBusiness|ProfessionalService|HomeAndConstructionBusiness|Plumber|HVACBusiness|Electrician|RoofingContractor|MedicalBusiness|[A-Za-z]*Business)"/i.test(html);
    out.hasChat = /(intercom|drift\.com|tawk\.to|tidio|livechat|crisp\.chat|hubspot.*conversations|zopim|zendesk|olark|chatbot|chat-widget|leadconnector|concierge|ai assistant|chat-fab|data-ai-chat)/i.test(low);
    out.hasBooking = /(calendly|zohobookings|acuityscheduling|squareup\.com\/appointments|book now|schedule (an |a )?(appointment|service|call)|housecallpro|servicetitan|jobber)/i.test(low);
    out.hasReviews = /(reviews?|testimonials?|stars?)/i.test(low);
  } catch { /* unreachable */ }
  return out;
}

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));

function score(ps, h) {
  const findings = [];
  const add = (area, level, text) => findings.push({ area, level, text });

  const speed = ps?.performance ?? null;
  if (speed === null) { /* not measured: PageSpeed unavailable */ }
  else if (speed < 50) add('Speed', 'bad', `Slow on phones (${speed}/100). Most visitors leave before a slow page loads.`);
  else if (speed < 90) add('Speed', 'warn', `Speed is middling (${speed}/100). Faster pages rank and convert better.`);

  let mobile = h.hasViewport ? (ps?.accessibility != null ? ps.accessibility * 0.6 + 40 : 90) : (ps?.accessibility ?? 50) * 0.4;
  if (!h.hasViewport) add('Mobile', 'bad', 'No mobile viewport tag. The site may look tiny or broken on phones.');
  if ((ps?.accessibility ?? 100) < 80) add('Mobile', 'warn', `Accessibility score is ${ps.accessibility}/100. Some visitors will struggle to use the site.`);

  let seo = (ps?.seo ?? 70) * 0.7 + (h.hasMetaDescription ? 10 : 0) + (h.h1Count === 1 ? 10 : 0) + (h.hasLocalSchema ? 10 : 0);
  if (!h.hasMetaDescription) add('SEO', 'warn', 'No meta description. Google writes its own, usually worse.');
  if (h.h1Count !== 1) add('SEO', 'warn', h.h1Count === 0 ? 'No main H1 heading on the page.' : `${h.h1Count} H1 headings. One clear H1 helps Google understand the page.`);
  if (!h.hasLocalSchema) add('SEO', 'warn', 'No local business schema. It helps you show up in local search and maps.');

  let trust = (h.finalHttps || h.https ? 40 : 0) + (ps?.bestPractices ?? 100) * 0.4 + (h.hasReviews ? 20 : 0);
  if (!(h.finalHttps || h.https)) add('Trust', 'bad', 'Not secure (no HTTPS). Browsers warn visitors away.');
  if (!h.hasReviews) add('Trust', 'warn', 'No reviews or testimonials found. Proof is what turns visitors into calls.');

  let leads = (h.hasTel ? 30 : 0) + (h.hasForm ? 25 : 0) + (h.hasChat ? 25 : 0) + (h.hasBooking ? 20 : 0);
  if (!h.hasTel) add('Missed leads', 'bad', 'No tap-to-call link. Phone visitors have to copy your number by hand.');
  if (!h.hasChat) add('Missed leads', 'bad', 'Nothing answers questions after hours. Night and weekend visitors leave.');
  if (!h.hasBooking) add('Missed leads', 'warn', 'No online booking. Every booking waits on a callback.');
  if (!h.hasForm) add('Missed leads', 'warn', 'No contact form found.');

  const scores = { speed: speed === null ? null : clamp(speed), mobile: clamp(mobile), seo: clamp(seo), trust: clamp(trust), leads: clamp(leads) };
  const W = { speed: 0.25, mobile: 0.15, seo: 0.2, trust: 0.15, leads: 0.25 };
  let sum = 0, wt = 0;
  for (const k in W) if (scores[k] !== null) { sum += scores[k] * W[k]; wt += W[k]; }
  const overall = clamp(sum / wt);
  const order = { bad: 0, warn: 1 };
  findings.sort((a, b) => order[a.level] - order[b.level]);
  return { overall, scores, findings };
}

export async function POST(req) {
  if (rateLimited(clientIp(req), 4)) return Response.json({ ok: false, error: 'Too many audits in a minute. Give it a moment.' }, { status: 429 });
  let body;
  try { body = await req.json(); } catch { return Response.json({ ok: false, error: 'Bad request' }, { status: 400 }); }
  let url;
  try { url = await normalize(body.url); } catch (e) { return Response.json({ ok: false, error: e.message }, { status: 400 }); }

  const [ps, h] = await Promise.all([pagespeed(url), inspect(url)]);
  if (!h.reachable && !ps) return Response.json({ ok: false, error: 'We couldn\'t load that site. Is it online?' }, { status: 422 });
  const result = score(ps, h);
  await insertRow('audits', { url, overall: result.overall, scores: { ...result.scores, pagespeed: ps }, findings: result.findings });
  return Response.json({ ok: true, url, ...result, metrics: ps ? { lcp: ps.lcp, cls: ps.cls, tbt: ps.tbt } : null, title: h.title || null });
}
