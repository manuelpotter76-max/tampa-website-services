// Minimal server-side Supabase writer using the REST API. Never import this into client components.
export async function insertRow(table, row) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.warn('[db] Supabase env not set; skipped insert into', table);
    return { stored: false };
  }
  try {
    const res = await fetch(`${url}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('[db] insert failed', table, res.status, await res.text());
      return { stored: false };
    }
    return { stored: true };
  } catch (e) {
    console.error('[db] insert error', table, e);
    return { stored: false };
  }
}

export async function notifyLead(subject, text) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL;
  if (!key || !to || !from) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, text }),
    });
  } catch (e) {
    console.error('[notify] failed', e);
  }
}

// Tiny per-instance rate limiter. Good enough to stop casual abuse; not a substitute for a real limiter.
const hits = new Map();
export function rateLimited(ip, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > limit;
}

export function clientIp(req) {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
}
