import { SITE } from '@/lib/site';

const LABELS = { speed: 'Speed', mobile: 'Mobile', seo: 'SEO', trust: 'Trust', leads: 'Missed leads' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };
const word = (n) => (n >= 90 ? 'Good' : n >= 50 ? 'Needs work' : 'Poor');
const hue = (n) => (n >= 90 ? '#2E9E5B' : n >= 50 ? '#B7791F' : '#C53030');

// Build the report email a visitor gets after asking for it.
export function auditReportEmail(audit) {
  const site = host(audit.url);
  const scores = Object.entries(audit.scores || {}).filter(([k]) => LABELS[k]);
  const findings = Array.isArray(audit.findings) ? audit.findings : [];
  const subject = `Your website score: ${audit.overall}/100 (${site})`;

  const text = [
    'Hi there,',
    '',
    `Here's the full report for ${site}.`,
    '',
    `Overall score: ${audit.overall}/100 (${word(audit.overall)})`,
    ...scores.map(([k, v]) => `${LABELS[k]}: ${v === null ? 'Not measured' : v + '/100'}`),
    '',
    findings.length ? 'What to fix:' : 'Nice work. We did not find anything major.',
    ...findings.map((f, i) => `${i + 1}. ${f.area}: ${f.text}`),
    '',
    findings.length ? `If you only do one thing, start with #1.` : '',
    '',
    `Want help fixing these? Book a quick call: ${SITE.bookingUrl}`,
    `Or just reply to this email. It comes straight to me.`,
    '',
    'Manny Potter',
    `Tampa Website Services · ${SITE.phone}`,
    '',
    `You got this email because you asked for your report on ${SITE.url.replace('https://', '')}. ${SITE.legalName}, ${SITE.location}.`,
  ].join('\n');

  const row = (label, v) => `<tr><td style="padding:8px 0;color:#334155">${esc(label)}</td><td style="padding:8px 0;text-align:right;font-weight:600;color:${v === null ? '#64748B' : hue(v)}">${v === null ? 'Not measured' : `${v} · ${word(v)}`}</td></tr>`;
  const html = `<!doctype html><html><body style="margin:0;background:#F1F5F9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:14px;overflow:hidden">
<tr><td style="background:#0B1020;padding:20px 28px;color:#F5F7FA;font-size:15px;font-weight:600">Tampa Website Services</td></tr>
<tr><td style="padding:28px">
<p style="margin:0 0 6px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#7C3AED">Your website report</p>
<h1 style="margin:0 0 4px;font-size:22px;color:#0B1020">${esc(site)}</h1>
<p style="margin:0 0 20px;color:#475569">Overall score <strong style="font-size:28px;color:${hue(audit.overall)}">${esc(audit.overall)}</strong>/100</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;margin-bottom:20px">${scores.map(([k, v]) => row(LABELS[k], v)).join('')}</table>
${findings.length ? `<h2 style="margin:0 0 10px;font-size:17px;color:#0B1020">What to fix</h2><ol style="margin:0 0 16px;padding-left:20px;color:#334155;line-height:1.55">${findings.map((f) => `<li style="margin:0 0 8px"><strong>${esc(f.area)}:</strong> ${esc(f.text)}</li>`).join('')}</ol><p style="margin:0 0 20px;color:#475569">If you only do one thing, start with #1.</p>` : `<p style="color:#334155">Nice work. We didn't find anything major.</p>`}
<p style="margin:0 0 24px"><a href="${esc(SITE.bookingUrl)}" style="display:inline-block;background:#7C3AED;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600">Book a call to fix these</a></p>
<p style="margin:0;color:#334155">Or just reply to this email. It comes straight to me.</p>
<p style="margin:16px 0 0;color:#0B1020"><strong>Manny Potter</strong><br><span style="color:#475569">Tampa Website Services · <a href="${esc(SITE.phoneHref)}" style="color:#475569">${esc(SITE.phone)}</a></span></p>
</td></tr>
<tr><td style="padding:16px 28px;background:#F8FAFC;color:#64748B;font-size:12px">You got this email because you asked for your report on ${esc(SITE.url.replace('https://', ''))}. ${esc(SITE.legalName)}, ${esc(SITE.location)}.</td></tr>
</table></td></tr></table></body></html>`;

  return { subject, text, html };
}

// Plain-text alert for Manny.
export function leadAlert(lead, audit) {
  const lines = [
    `Source: ${lead.source}`,
    lead.name && `Name: ${lead.name}`,
    lead.email && `Email: ${lead.email}`,
    lead.phone && `Phone: ${lead.phone}${lead.source === 'audit' ? '  (wants a walkthrough, call them)' : ''}`,
    lead.website && `Website: ${lead.website}`,
    lead.message && `\nMessage:\n${lead.message}`,
    lead.sms_consent && '\nOK to text: yes',
  ];
  if (audit) {
    lines.push('', `Audit score: ${audit.overall}/100`);
    (audit.findings || []).slice(0, 5).forEach((f, i) => lines.push(`${i + 1}. ${f.area}: ${f.text}`));
  }
  lines.push('', `Page: ${lead.page || 'n/a'}`);
  return lines.filter((x) => x !== null && x !== undefined && x !== false && x !== '').join('\n');
}
