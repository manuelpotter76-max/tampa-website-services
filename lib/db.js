// Minimal server-side Supabase writer using the REST API. Never import this into client components.
export async function insertRow(table, row, { returnRow = false, upsertOn = null } = {}) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.warn('[db] Supabase env not set; skipped insert into', table);
    return { stored: false };
  }
  try {
    const res = await fetch(`${url}/rest/v1/${table}${upsertOn ? `?on_conflict=${upsertOn}` : ''}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: [returnRow ? 'return=representation' : 'return=minimal', upsertOn && 'resolution=merge-duplicates'].filter(Boolean).join(','),
      },
      body: JSON.stringify(row),
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('[db] insert failed', table, res.status, await res.text());
      return { stored: false };
    }
    if (returnRow) { const data = await res.json().catch(() => []); return { stored: true, row: data[0] || null }; }
    return { stored: true };
  } catch (e) {
    console.error('[db] insert error', table, e);
    return { stored: false };
  }
}

function sb() {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' } } : null;
}

export async function getRow(table, id) {
  const c = sb();
  if (!c || !/^[0-9a-f-]{36}$/i.test(String(id || ''))) return null;
  try {
    const res = await fetch(`${c.url}/rest/v1/${table}?id=eq.${id}&limit=1`, { headers: c.headers, cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json())[0] || null;
  } catch { return null; }
}

export async function updateRow(table, id, patch) {
  const c = sb();
  if (!c || !/^[0-9a-f-]{36}$/i.test(String(id || ''))) return false;
  try {
    const res = await fetch(`${c.url}/rest/v1/${table}?id=eq.${id}`, { method: 'PATCH', headers: { ...c.headers, Prefer: 'return=minimal' }, body: JSON.stringify(patch), cache: 'no-store' });
    return res.ok;
  } catch { return false; }
}

// Send one email through Resend. Returns true when Resend accepted it.
export async function sendEmail({ to, subject, text, html, replyTo }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM_EMAIL;
  if (!key || !from || !to) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, text, html, reply_to: replyTo || undefined }),
    });
    if (!res.ok) console.error('[email] Resend rejected', res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error('[email] failed', e);
    return false;
  }
}

// Alert Manny about a new lead.
export async function notifyLead(subject, text) {
  return sendEmail({ to: process.env.LEAD_NOTIFY_EMAIL, subject, text });
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
