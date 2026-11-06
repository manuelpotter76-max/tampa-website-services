// Zoho CRM (US data center). Server-only: never import this into client components.
// Every lead is tagged with Brand = Tampa Website Services, and we only ever match or update
// leads that already carry that brand, so other brands in the same CRM are never touched.
import { insertRow, selectRows } from '@/lib/db';

const ACCOUNTS = 'https://accounts.zoho.com';
const API = 'https://www.zohoapis.com/crm/v8';
const DEFAULT_BRAND_FIELD = process.env.ZOHO_BRAND_FIELD || 'Brand';
export const BRAND_VALUE = process.env.ZOHO_BRAND_VALUE || 'Tampa Website Services';
export const ZOHO_SCOPES = 'ZohoCRM.modules.leads.ALL,ZohoCRM.modules.notes.ALL,ZohoCRM.settings.fields.READ';

const clientId = () => process.env.ZOHO_CLIENT_ID;
const clientSecret = () => process.env.ZOHO_CLIENT_SECRET;
export const zohoConfigured = () => Boolean(clientId() && clientSecret());

// The Brand field's API name, as found in Zoho during setup (falls back to "Brand").
let brandFieldCache = null;
async function brandField() {
  if (process.env.ZOHO_BRAND_FIELD) return process.env.ZOHO_BRAND_FIELD;
  if (brandFieldCache) return brandFieldCache;
  const rows = await selectRows('app_settings', 'select=value&key=eq.zoho_brand_field&limit=1');
  brandFieldCache = rows[0]?.value || DEFAULT_BRAND_FIELD;
  return brandFieldCache;
}

async function refreshToken() {
  if (process.env.ZOHO_REFRESH_TOKEN) return process.env.ZOHO_REFRESH_TOKEN;
  const rows = await selectRows('app_settings', 'select=value&key=eq.zoho_refresh_token&limit=1');
  return rows[0]?.value || null;
}

// Swap the one-time code from the Zoho API Console for a long-lived refresh token, and save it.
export async function connectWithGrantCode(code) {
  const qs = new URLSearchParams({ grant_type: 'authorization_code', client_id: clientId(), client_secret: clientSecret(), code });
  const r = await fetch(`${ACCOUNTS}/oauth/v2/token?${qs}`, { method: 'POST', cache: 'no-store' });
  const j = await r.json().catch(() => ({}));
  if (!j.refresh_token) return { ok: false, error: j.error || `Zoho said ${r.status}` };
  const saved = await insertRow('app_settings', { key: 'zoho_refresh_token', value: j.refresh_token, updated_at: new Date().toISOString() }, { upsertOn: 'key' });
  if (!saved.stored) return { ok: false, error: 'Could not save the connection to the database.' };
  cached = { token: j.access_token, until: Date.now() + 50 * 60_000 };
  return { ok: true };
}

let cached = { token: null, until: 0 };
async function accessToken() {
  if (cached.token && Date.now() < cached.until) return cached.token;
  const rt = await refreshToken();
  if (!rt || !zohoConfigured()) return null;
  const qs = new URLSearchParams({ grant_type: 'refresh_token', client_id: clientId(), client_secret: clientSecret(), refresh_token: rt });
  const r = await fetch(`${ACCOUNTS}/oauth/v2/token?${qs}`, { method: 'POST', cache: 'no-store' });
  const j = await r.json().catch(() => ({}));
  if (!j.access_token) { console.error('[zoho] token refresh failed', r.status, j.error); return null; }
  cached = { token: j.access_token, until: Date.now() + 50 * 60_000 }; // tokens last 60 minutes
  return cached.token;
}

async function zoho(path, init = {}) {
  const token = await accessToken();
  if (!token) return { status: 0, json: null };
  const r = await fetch(`${API}${path}`, { ...init, headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json', ...(init.headers || {}) }, cache: 'no-store' });
  const json = r.status === 204 ? null : await r.json().catch(() => null);
  return { status: r.status, json };
}

// Check the Brand field exists on Leads and has our option. Used by the setup page.
export async function checkBrandField() {
  const { status, json } = await zoho('/settings/fields?module=Leads');
  if (status !== 200) return { ok: false, error: `Could not read Lead fields (status ${status}).` };
  const fields = json?.fields || [];
  const f = fields.find((x) => x.api_name === DEFAULT_BRAND_FIELD) || fields.find((x) => (x.field_label || '').toLowerCase() === 'brand');
  if (!f) return { ok: false, error: `No field called "Brand" on Leads.` };
  brandFieldCache = f.api_name;
  await insertRow('app_settings', { key: 'zoho_brand_field', value: f.api_name, updated_at: new Date().toISOString() }, { upsertOn: 'key' });
  const options = (f.pick_list_values || []).map((o) => o.actual_value || o.display_value);
  const hasOption = options.length === 0 || options.includes(BRAND_VALUE);
  return { ok: hasOption, apiName: f.api_name, options, error: hasOption ? null : `The Brand field has no "${BRAND_VALUE}" option.` };
}

const q = (v) => String(v).replace(/[(),\\]/g, (c) => '\\' + c); // escape for Zoho search criteria

// Brand is a multi-select picklist in Manny's CRM (a list of brands), but handle a single value too.
const hasBrand = (v) => (Array.isArray(v) ? v : [v]).some((x) => (x?.name || x) === BRAND_VALUE);

// Find an existing lead with this email or phone that is tagged with our brand. Leads from other brands are ignored.
async function findBrandLead({ email, phone }) {
  const field = await brandField();
  const tries = [];
  if (email) tries.push(`(Email:equals:${q(email)})`);
  if (phone) tries.push(`(Phone:equals:${q(phone)})`);
  for (const criteria of tries) {
    const { status, json } = await zoho(`/Leads/search?criteria=${encodeURIComponent(criteria)}&fields=id,${field}`);
    const match = status === 200 ? (json?.data || []).find((r) => hasBrand(r[field])) : null;
    if (match) return match.id;
  }
  return null;
}

async function addNote(id, title, content) {
  if (!content) return;
  const { status, json } = await zoho(`/Leads/${id}/Notes`, { method: 'POST', body: JSON.stringify({ data: [{ Note_Title: title.slice(0, 120), Note_Content: content.slice(0, 30000) }] }) });
  if (status >= 300) console.error('[zoho] note failed', status, JSON.stringify(json).slice(0, 300));
}

const hostOf = (u) => { try { return new URL(/^https?:/.test(u) ? u : 'https://' + u).hostname.replace(/^www\./, ''); } catch { return ''; } };

// Add or update a Tampa Website Services lead in Zoho CRM. Never throws.
// source: one of 'Website - Contact form' | 'Website - Audit' | 'Website - Chat' | 'Missed call'
export async function pushLeadToZoho({ name = '', email = '', phone = '', website = '', source, noteTitle, note }) {
  try {
    if (!zohoConfigured() || !(email || phone)) return { ok: false, skipped: true };
    const existing = await findBrandLead({ email, phone });
    if (existing) {
      await addNote(existing, noteTitle || source, note);
      return { ok: true, id: existing, action: 'note' };
    }

    const parts = name.trim().split(/\s+/).filter(Boolean);
    const last = parts.length > 1 ? parts.pop() : parts[0] || (source === 'Missed call' ? 'Caller' : 'Website lead');
    const first = parts.length && parts.join(' ') !== last ? parts.join(' ') : undefined;
    const record = {
      Last_Name: last.slice(0, 80),
      ...(first ? { First_Name: first.slice(0, 40) } : {}),
      ...(email ? { Email: email } : {}),
      ...(phone ? { Phone: phone } : {}),
      ...(website ? { Website: website } : {}),
      Company: hostOf(website) || name || email || phone || 'Unknown',
      Lead_Source: source,
    };
    const field = await brandField();
    record[field] = [BRAND_VALUE]; // multi-select picklist
    let res, row;
    for (let attempt = 0; attempt < 3; attempt++) {
      res = await zoho('/Leads', { method: 'POST', body: JSON.stringify({ data: [record], trigger: ['workflow'] }) });
      row = res.json?.data?.[0];
      if (row?.code !== 'INVALID_DATA') break;
      const bad = row?.details?.api_name;
      // Brand set up as a single-choice picklist instead: send one value.
      if (bad === field && Array.isArray(record[field])) { record[field] = BRAND_VALUE; continue; }
      // "Lead Source" doesn't have our option: save the lead without it rather than lose it.
      if (bad === 'Lead_Source' && record.Lead_Source) { delete record.Lead_Source; continue; }
      break;
    }
    if (row?.code !== 'SUCCESS') { console.error('[zoho] create failed', res.status, JSON.stringify(res.json).slice(0, 400)); return { ok: false }; }
    const id = row.details.id;
    await addNote(id, noteTitle || source, `How they found us: ${source}\n\n${note || ''}`.trim());
    return { ok: true, id, action: 'created' };
  } catch (e) {
    console.error('[zoho] push failed', e);
    return { ok: false };
  }
}
