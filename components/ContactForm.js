'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SITE } from '@/lib/site';

import { SMS_CONSENT_TEXT } from '@/lib/consent';

export default function ContactForm() {
  const page = usePathname();
  const [f, setF] = useState({ name: '', email: '', phone: '', website: '', message: '', sms_consent: false, company_website: '' });
  const [state, setState] = useState('idle');
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (!f.email && !f.phone) { setErr('Add an email or a phone number so we can reach you.'); return; }
    setState('sending');
    try {
      const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, source: 'contact', page, sms_consent_text: f.sms_consent ? SMS_CONSENT_TEXT : null }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Something went wrong.');
      setState('sent');
    } catch (x) {
      setErr(x.message + ' You can also call ' + SITE.phone + '.');
      setState('idle');
    }
  }

  if (state === 'sent') {
    return (
      <div className="stack gap-4" role="status">
        <h2 className="h3">Got it. Thanks, {f.name.split(' ')[0] || 'friend'}.</h2>
        <p className="muted">Manny will get back to you within one business day. Want to skip the wait?</p>
        <a href={SITE.bookingUrl} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Book a call now</a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="stack gap-4" noValidate>
      <div className="grid" style={{ '--min': '220px', gap: 16 }}>
        <label className="label">Name<input className="input" name="name" autoComplete="name" value={f.name} onChange={set('name')} required /></label>
        <label className="label">Email<input className="input" type="email" name="email" autoComplete="email" value={f.email} onChange={set('email')} /></label>
        <label className="label">Phone<input className="input" type="tel" name="phone" autoComplete="tel" value={f.phone} onChange={set('phone')} /></label>
        <label className="label">Current website <span className="hint">Optional</span><input className="input" type="text" inputMode="url" name="website" autoComplete="url" value={f.website} onChange={set('website')} placeholder="yourbusiness.com" /></label>
      </div>
      <label className="label">What do you need?<textarea className="textarea" name="message" value={f.message} onChange={set('message')} placeholder="A new site, a redesign, the AI concierge, help with ads..." /></label>
      <div className="honeypot" aria-hidden="true"><label>Leave this empty<input tabIndex={-1} autoComplete="off" name="company_website" value={f.company_website} onChange={set('company_website')} /></label></div>
      <label className="check"><input type="checkbox" checked={f.sms_consent} onChange={set('sms_consent')} /><span>{SMS_CONSENT_TEXT} See our <a className="textlink" href="/privacy-policy">privacy policy</a> and <a className="textlink" href="/terms">terms</a>.</span></label>
      {err && <p className="error" role="alert">{err}</p>}
      <button className="btn btn-primary" type="submit" disabled={state === 'sending'} style={{ alignSelf: 'flex-start' }}>{state === 'sending' ? 'Sending...' : 'Send message'}</button>
    </form>
  );
}
