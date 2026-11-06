// Zoho CRM (US data center). Server-only: never import this into client components.
// Every lead is tagged with Brand = Tampa Website Services, and we only ever match or update
// leads that already carry that brand, so other brands in the same CRM are never touched.
import { insertRow, selectRows } from '@/lib/db';

const ACCOUNTS = 'https://accounts.zoho.com';
const API = 'https://www.zohoapis.com/crm/v8';
const DEFAULT_BRAND_FIELD = process.env.ZOHO_BRAND_FIELD || 'Brand';
export const BRAND_VALUE = process.env.ZOHO_BRAND_VALUE || 'Tampa Website Services';
export const ZOHO_SCOPES = 'ZohoCRM.modules.leads.ALL,ZohoCRM.modules.contacts.ALL,ZohoCRM.modules.notes.ALL,ZohoCRM.settings.fields.READ';
export const LEAD_STATUS = process.env.ZOHO_LEAD_STATUS || 'New Opportunity';

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
  const ls = fields.find((x) => x.api_name === 'Lead_Status');
  const statusOptions = (ls?.pick_list_values || []).map((o) => o.actual_value || o.display_value);
  const statusOk = statusOptions.includes(LEAD_STATUS);
  return { ok: hasOption, apiName: f.api_name, options, statusOk, statusOptions, leadStatus: LEAD_STATUS, error: hasOption ? null : `The Brand field has no "${BRAND_VALUE}" option.` };
}

const q = (v) => String(v).replace(/[(),\\]/g, (c) => '\\' + c); // escape for Zoho search criteria

// Brand is a multi-select picklist in Manny's CRM (a list of brands), but handle a single value too.
const brandList = (v) => (v == null ? [] : (Array.isArray(v) ? v : [v]).map((x) => x?.name || x).filter(Boolean));
const hasBrand = (v) => brandList(v).includes(BRAND_VALUE);
const digits = (p) => String(p || '').replace(/\D/g, '').slice(-10);

// Look for this person anywhere in the CRM: Leads first, then Contacts. Any brand.
// If several match, prefer one already tagged Tampa Website Services.
async function findExisting({ email, phone }) {
  const field = await brandField();
  for (const module of ['Leads', 'Contacts']) {
    const tries = [];
    if (email) tries.push(`(Email:equals:${q(email)})`);
    if (phone) tries.push(`(Phone:equals:${q(phone)})`, `(Mobile:equals:${q(phone)})`);
    for (const criteria of tries) {
      const { status, json } = await zoho(`/${module}/search?criteria=${encodeURIComponent(criteria)}&fields=id,Email,Phone,Mobile,Website,${field}`);
      const rows = status === 200 ? json?.data || [] : [];
      if (rows.length) return { module, record: rows.find((r) => hasBrand(r[field])) || rows[0] };
    }
  }
  return null;
}

async function addNote(module, id, title, content) {
  if (!content) return;
  const { status, json } = await zoho(`/${module}/${id}/Notes`, { method: 'POST', body: JSON.stringify({ data: [{ Note_Title: title.slice(0, 120), Note_Content: content.slice(0, 30000) }] }) });
  if (status >= 300) console.error('[zoho] note failed', module, status, JSON.stringify(json).slice(0, 300));
}

// Existing person: only fill in blanks and add our brand next to any brands they already have. Never overwrite.
async function updateExisting(module, r, { email, phone, website }) {
  const field = await brandField();
  const patch = {};
  if (email && !r.Email) patch.Email = email;
  if (phone && !r.Phone && digits(r.Mobile) !== digits(phone)) patch.Phone = phone;
  if (website && !r.Website) patch.Website = website;
  if (field in r && !hasBrand(r[field])) patch[field] = [...brandList(r[field]), BRAND_VALUE];
  if (!Object.keys(patch).length) return;
  let res = await zoho(`/${module}`, { method: 'PUT', body: JSON.stringify({ data: [{ id: r.id, ...patch }], trigger: [] }) });
  let row = res.json?.data?.[0];
  if (row?.code === 'INVALID_DATA' && row?.details?.api_name === field && Array.isArray(patch[field])) {
    patch[field] = BRAND_VALUE; // single-choice Brand field
    res = await zoho(`/${module}`, { method: 'PUT', body: JSON.stringify({ data: [{ id: r.id, ...patch }], trigger: [] }) });
    row = res.json?.data?.[0];
  }
  if (row?.code !== 'SUCCESS') console.error('[zoho] update failed', module, res.status, JSON.stringify(res.json).slice(0, 300));
}

const hostOf = (u) => { try { return new URL(/^https?:/.test(u) ? u : 'https://' + u).hostname.replace(/^www\./, ''); } catch { return ''; } };

// Add a website lead to Zoho CRM. Never throws.
// If the person already exists (as a Lead or a Contact), only that record is updated: a note is added,
// blanks are filled, and Tampa Website Services is added to its Brand list. Otherwise a new Lead is
// created with Brand = Tampa Website Services and Lead Status = New Opportunity.
// source: 'Website - Contact form' | 'Website - Audit' | 'Website - Chat' | 'Missed call'
export async function pushLeadToZoho({ name = '', email = '', phone = '', website = '', source, noteTitle, note }) {
  try {
    if (!zohoConfigured() || !(email || phone)) return { ok: false, skipped: true };
    const found = await findExisting({ email, phone });
    if (found) {
      await updateExisting(found.module, found.record, { email, phone, website });
      await addNote(found.module, found.record.id, noteTitle || source, `How they reached us: ${source}\n\n${note || ''}`.trim());
      return { ok: true, id: found.record.id, module: found.module, action: 'updated' };
    }

    const parts = name.trim().split(/\s+/).filter(Boolean);
    const last = parts.length > 1 ? parts.pop() : parts[0] || (source === 'Missed call' ? 'Caller' : 'Website lead');
    const first = parts.length && parts.join(' ') !== last ? parts.join(' ') : undefined;
    const field = await brandField();
    const record = {
      Last_Name: last.slice(0, 80),
      ...(first ? { First_Name: first.slice(0, 40) } : {}),
      ...(email ? { Email: email } : {}),
      ...(phone ? { Phone: phone } : {}),
      ...(website ? { Website: website } : {}),
      Company: hostOf(website) || name || email || phone || 'Unknown',
      Lead_Source: source,
      Lead_Status: LEAD_STATUS,
      [field]: [BRAND_VALUE], // multi-select picklist
    };
    let res, row;
    for (let attempt = 0; attempt < 4; attempt++) {
      res = await zoho('/Leads', { method: 'POST', body: JSON.stringify({ data: [record], trigger: ['workflow'] }) });
      row = res.json?.data?.[0];
      if (row?.code !== 'INVALID_DATA') break;
      const bad = row?.details?.api_name;
      // Brand set up as a single-choice picklist instead: send one value.
      if (bad === field && Array.isArray(record[field])) { record[field] = BRAND_VALUE; continue; }
      // A picklist doesn't have our option: save the lead without it rather than lose it.
      if (bad === 'Lead_Source' && record.Lead_Source) { delete record.Lead_Source; continue; }
      if (bad === 'Lead_Status' && record.Lead_Status) { console.error('[zoho] Lead Status option missing:', LEAD_STATUS); delete record.Lead_Status; continue; }
      break;
    }
    if (row?.code !== 'SUCCESS') { console.error('[zoho] create failed', res.status, JSON.stringify(res.json).slice(0, 400)); return { ok: false }; }
    const id = row.details.id;
    await addNote('Leads', id, noteTitle || source, `How they reached us: ${source}\n\n${note || ''}`.trim());
    return { ok: true, id, module: 'Leads', action: 'created' };
  } catch (e) {
    console.error('[zoho] push failed', e);
    return { ok: false };
  }
}
