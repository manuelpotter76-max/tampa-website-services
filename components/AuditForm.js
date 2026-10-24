'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SITE } from '@/lib/site';

const LABELS = { speed: 'Speed', mobile: 'Mobile', seo: 'SEO', trust: 'Trust', leads: 'Missed leads' };
const color = (n) => (n >= 90 ? 'var(--success)' : n >= 50 ? 'var(--warning)' : 'var(--danger)');
const word = (n) => (n >= 90 ? 'Good' : n >= 50 ? 'Needs work' : 'Poor');

function Ring({ value }) {
  const r = 54, c = 2 * Math.PI * r, off = c * (1 - value / 100);
  return (
    <svg className="score-ring" viewBox="0 0 132 132" role="img" aria-label={`Overall score ${value} out of 100, ${word(value)}`}>
      <circle cx="66" cy="66" r={r} fill="none" stroke="#26304D" strokeWidth="10" />
      <circle cx="66" cy="66" r={r} fill="none" stroke={color(value)} strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 66 66)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="66" y="72" textAnchor="middle" fill="#F5F7FA" fontSize="34" fontWeight="600">{value}</text>
    </svg>
  );
}

export default function AuditForm({ id = 'audit', full = false }) {
  const path = usePathname();
  const [url, setUrl] = useState('');
  const [state, setState] = useState('idle');
  const [err, setErr] = useState('');
  const [res, setRes] = useState(null);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function run(e) {
    e.preventDefault();
    setErr(''); setRes(null); setState('loading');
    try {
      const r = await fetch('/api/audit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
      const j = await r.json();
      if (!j.ok) { setErr(j.error || 'Something went wrong.'); setState('idle'); return; }
      setRes(j); setState('done');
    } catch { setErr('Something went wrong. Try again?'); setState('idle'); }
  }

  async function unlock(e) {
    e.preventDefault();
    const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: 'audit', email, website: res?.url, page: path, meta: { overall: res?.overall, scores: res?.scores } }) });
    const j = await r.json().catch(() => ({}));
    if (j.ok) setSent(true); else setErr(j.error || 'Could not send. Try again?');
  }

  return (
    <div className="stack gap-4">
      <form id={id} onSubmit={run} className="card-raised card-glow stack gap-2">
        <label htmlFor={id + '-url'} style={{ fontSize: 14, fontWeight: 500 }}>Your website URL</label>
        <div className="row gap-3">
          <input id={id + '-url'} className="input mono" style={{ flex: '1 1 240px', fontSize: 16 }} type="text" inputMode="url" autoComplete="url" placeholder="yourbusiness.com" value={url} onChange={(e) => setUrl(e.target.value)} required />
          <button type="submit" className="btn btn-primary" disabled={state === 'loading'}>{state === 'loading' ? 'Scanning…' : 'Get my score'}</button>
        </div>
        <p className="small muted" style={{ marginTop: 4 }}>{state === 'loading' ? 'Checking speed, mobile, SEO, trust and missed leads. This takes up to a minute.' : 'Speed, mobile, SEO, trust and missed leads, scored in about 60 seconds. Email unlocks the full report.'}</p>
        {err && <p className="error" role="alert">{err}</p>}
      </form>

      {res && (
        <div className="card stack gap-5" aria-live="polite">
          <div className="row gap-6 center">
            <Ring value={res.overall} />
            <div className="stack gap-2" style={{ flex: '1 1 220px' }}>
              <p className="eyebrow muted">Overall score</p>
              <p className="h4">{res.title || res.url}</p>
              <p className="small muted">{word(res.overall)}. {res.findings.length ? `We found ${res.findings.length} things costing you leads.` : 'Nice work. Your site covers the basics.'}</p>
            </div>
          </div>
          <div className="grid" style={{ '--min': '150px' }}>
            {Object.entries(res.scores).map(([k, v]) => (
              <div key={k} className="stack gap-2">
                <div className="row between small"><span>{LABELS[k]}</span><span style={{ color: color(v) }}>{v} · {word(v)}</span></div>
                <div className="meter"><span style={{ width: v + '%', background: color(v) }} /></div>
              </div>
            ))}
          </div>
          {res.metrics && <p className="tiny muted mono">Mobile: LCP {res.metrics.lcp || 'n/a'} · CLS {res.metrics.cls || 'n/a'} · TBT {res.metrics.tbt || 'n/a'}</p>}
          {res.findings.length > 0 && (
            <ul className="list-clean stack gap-2">
              {(full || sent ? res.findings : res.findings.slice(0, 3)).map((f, i) => (
                <li key={i} className="card-raised card-tight row gap-3" style={{ alignItems: 'flex-start' }}>
                  <span className="tag" style={{ background: f.level === 'bad' ? '#3A1F2A' : '#3A3220', color: f.level === 'bad' ? 'var(--danger)' : 'var(--warning)', flex: '0 0 auto' }}>{f.level === 'bad' ? 'Fix' : 'Improve'}</span>
                  <span className="small"><strong>{f.area}:</strong> {f.text}</span>
                </li>
              ))}
            </ul>
          )}
          {!sent && !full && res.findings.length > 3 && (
            <form onSubmit={unlock} className="stack gap-2">
              <label htmlFor={id + '-email'} className="small" style={{ fontWeight: 500 }}>Email me the full report ({res.findings.length - 3} more findings)</label>
              <div className="row gap-3">
                <input id={id + '-email'} className="input" style={{ flex: '1 1 220px' }} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" />
                <button className="btn btn-secondary" type="submit">Unlock the report</button>
              </div>
            </form>
          )}
          {sent && <p className="small" role="status">Got it. Manny will send the full report and a few quick fixes.</p>}
          <div className="row gap-3">
            <a className="btn btn-primary" href={SITE.bookingUrl}>Book a call to fix these</a>
          </div>
        </div>
      )}
    </div>
  );
}
