import { SITE } from '@/lib/site';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const EMAIL_RE = /[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}/gi;
const PHONE_RE = /(?:\+?1[-. ]?)?\(?\b\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}\b/g;
const OUR_PHONE = SITE.phone.replace(/\D/g, '');

// Contact details the visitor typed into the chat (not ours).
export function contactsIn(messages) {
  const text = messages.filter((m) => m.role === 'user').map((m) => m.content).join('\n');
  const emails = [...new Set((text.match(EMAIL_RE) || []).map((e) => e.toLowerCase()))];
  const phones = [...new Set((text.match(PHONE_RE) || []).filter((p) => !p.replace(/\D/g, '').endsWith(OUR_PHONE)))];
  return { emails, phones };
}

const when = (d) => new Date(d).toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

// Email to Manny with a finished chat. `startAt` > 0 means a follow-up with only the new messages.
export function chatTranscriptEmail(chat, startAt = 0) {
  const all = Array.isArray(chat.messages) ? chat.messages : [];
  const msgs = all.slice(startAt);
  const userCount = all.filter((m) => m.role === 'user').length;
  const { emails, phones } = contactsIn(all);
  const hasContact = emails.length || phones.length;
  const page = chat.page || '/';
  const followUp = startAt > 0;

  const subject = `${followUp ? 'Chat continued' : 'Website chat'}: ${userCount} messages on ${page}${hasContact ? ' (left contact info)' : ''}`;

  const contactLine = hasContact ? `They shared: ${[...emails, ...phones].join(', ')}` : 'No contact info shared in the chat.';
  const text = [
    followUp ? 'A visitor came back to the chat. New messages below.' : 'A visitor finished a chat on your website.',
    '',
    `Page: ${SITE.url}${page}`,
    `Last message: ${when(chat.updated_at)}`,
    contactLine,
    '',
    ...msgs.map((m) => `${m.role === 'user' ? 'VISITOR' : 'AI ASSISTANT'}:\n${m.content}\n`),
  ].join('\n');

  const bubble = (m) => m.role === 'user'
    ? `<tr><td style="padding:6px 0"><div style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#7C3AED;margin-bottom:4px">Visitor</div><div style="background:#EDE9FE;color:#1E1B4B;border-radius:12px;padding:10px 14px;line-height:1.5;white-space:pre-wrap">${esc(m.content)}</div></td></tr>`
    : `<tr><td style="padding:6px 0"><div style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#64748B;margin-bottom:4px">AI assistant</div><div style="background:#F1F5F9;color:#0F172A;border-radius:12px;padding:10px 14px;line-height:1.5;white-space:pre-wrap">${esc(m.content)}</div></td></tr>`;

  const html = `<!doctype html><html><body style="margin:0;background:#F1F5F9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:14px;overflow:hidden">
<tr><td style="background:#0B1020;padding:18px 24px;color:#F5F7FA;font-size:15px;font-weight:600">${followUp ? 'Chat continued' : 'New website chat'}</td></tr>
<tr><td style="padding:20px 24px 8px;color:#334155;font-size:14px;line-height:1.6">
<div><strong>Page:</strong> <a href="${esc(SITE.url + page)}" style="color:#7C3AED">${esc(page)}</a></div>
<div><strong>Last message:</strong> ${esc(when(chat.updated_at))}</div>
<div style="margin-top:8px;padding:10px 12px;border-radius:8px;background:${hasContact ? '#DCFCE7;color:#14532D' : '#F8FAFC;color:#475569'}">${hasContact ? `<strong>They shared:</strong> ${[...emails.map((e) => `<a href="mailto:${esc(e)}">${esc(e)}</a>`), ...phones.map((p) => `<a href="tel:+1${esc(p.replace(/\D/g, '').slice(-10))}">${esc(p)}</a>`)].join(', ')}` : 'No contact info shared in the chat.'}</div>
</td></tr>
<tr><td style="padding:8px 24px 24px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${msgs.map(bubble).join('')}</table></td></tr>
</table></td></tr></table></body></html>`;

  return { subject, text, html };
}
