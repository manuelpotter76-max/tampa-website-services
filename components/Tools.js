'use client';
import { useState } from 'react';
import { PRICES, money, SITE } from '@/lib/site';

export function FollowupCalculator() {
  const [v, setV] = useState({ leads: '', cold: '', close: '', job: '' });
  const num = (x) => { const n = parseFloat(x); return isNaN(n) ? 0 : n; };
  const L = num(v.leads), C = num(v.cold), R = num(v.close), J = num(v.job);
  const ready = L > 0 && C > 0 && R > 0 && J > 0;
  const jobs = L * (C / 100) * (R / 100) * 12;
  const field = (k, label, ph) => (
    <label className="label" style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{label}
      <input className="input mono" type="number" inputMode="numeric" min="0" placeholder={ph} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
    </label>
  );
  return (
    <div className="stack gap-4">
      <div className="grid" style={{ '--min': '150px', gap: 12 }}>
        {field('leads', 'Leads a month', '40')}
        {field('cold', '% that go cold before you reply', '25')}
        {field('close', 'Your close rate %', '30')}
        {field('job', 'Average job $', '1200')}
      </div>
      <div className="card-tight" style={{ background: 'var(--bg)', border: '1px solid var(--hairline)' }} aria-live="polite">
        {ready ? (
          <div className="stack gap-2">
            <span className="small muted">Money left on the table each year</span>
            <span className="stat accent">{money(jobs * J)}</span>
            <span className="small muted">About {Math.round(jobs)} jobs a year lost to slow follow-up.</span>
          </div>
        ) : <span className="small muted">Fill in all four boxes to see your yearly number.</span>}
      </div>
    </div>
  );
}

const ADDONS = [{ id: 'chat', label: 'AI concierge' }, { id: 'text', label: 'Missed-call text-back' }, { id: 'follow', label: 'Lead follow-up' }, { id: 'book', label: 'Booking' }, { id: 'reviews', label: 'Review engine' }];

export function Configurator({ compact = false }) {
  const [site, setSite] = useState('starter');
  const [ai, setAi] = useState({});
  const [plans, setPlans] = useState({});
  const aiCount = Object.values(ai).filter(Boolean).length;
  const anyAi = aiCount > 0;
  const aiPrice = PRICES.ai + Math.max(0, aiCount - 1) * PRICES.aiExtra;
  const monthly = PRICES.plans.filter((p) => plans[p.id]).reduce((s, p) => s + p.price, 0);
  const pkg = anyAi ? ['AI Growth System', aiPrice] : site === 'growth' ? ['Growth Website', PRICES.growth] : ['Starter Website', PRICES.starter];
  return (
    <div className="stack gap-5">
      <fieldset style={{ border: 0, margin: 0, padding: 0 }} className="stack gap-2">
        <legend className="small muted" style={{ marginBottom: 8, fontWeight: 500 }}>1. Your website</legend>
        <div className="row gap-2">
          <button type="button" className="toggle sq" aria-pressed={site === 'starter'} onClick={() => setSite('starter')}>Starter · {money(PRICES.starter)}</button>
          <button type="button" className="toggle sq" aria-pressed={site === 'growth'} onClick={() => setSite('growth')}>Growth · {money(PRICES.growth)}</button>
        </div>
      </fieldset>
      <fieldset style={{ border: 0, margin: 0, padding: 0 }} className="stack gap-2">
        <legend className="small muted" style={{ marginBottom: 8, fontWeight: 500 }}>2. Add AI that works for you</legend>
        <span className="tiny muted">First AI tool makes it the AI Growth System at {money(PRICES.ai)}. Each extra tool adds {money(PRICES.aiExtra)}.</span>
        <div className="row gap-2">
          {ADDONS.map((a) => <button key={a.id} type="button" className="toggle" aria-pressed={!!ai[a.id]} onClick={() => setAi({ ...ai, [a.id]: !ai[a.id] })}>{a.label}</button>)}
        </div>
      </fieldset>
      {!compact && (
        <fieldset style={{ border: 0, margin: 0, padding: 0 }} className="stack gap-2">
          <legend className="small muted" style={{ marginBottom: 8, fontWeight: 500 }}>3. Monthly plans (optional)</legend>
          <div className="row gap-2">
            {PRICES.plans.map((p) => <button key={p.id} type="button" className="toggle" aria-pressed={!!plans[p.id]} onClick={() => setPlans({ ...plans, [p.id]: !plans[p.id] })}>{p.name} · {money(p.price)}/mo</button>)}
          </div>
        </fieldset>
      )}
      <div className="card-tight row between" style={{ background: 'var(--bg)', border: '1px solid var(--hairline)', alignItems: 'flex-end', gap: 16 }} aria-live="polite">
        <div className="stack gap-2">
          <span className="tiny muted">Your package</span>
          <span className="h4">{pkg[0]}</span>
          <span className="tiny muted">{monthly ? `plus ${money(monthly)}/mo in plans` : anyAi ? `Includes the custom website and ${aiCount} AI tool${aiCount > 1 ? 's' : ''}` : 'No monthly plan selected'}</span>
        </div>
        <div className="stack" style={{ alignItems: 'flex-end' }}>
          <span className="tiny muted">Starting at</span>
          <span className="stat accent" style={{ fontSize: compact ? 32 : 44 }}>{money(pkg[1])}</span>
        </div>
      </div>
      {!compact && <a className="btn btn-primary" href={SITE.bookingUrl}>Book a call to lock this in</a>}
    </div>
  );
}

export function BeforeAfter({ before, after, beforeAlt, afterAlt, beforeLabel = 'Before', afterLabel = 'After' }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="stack gap-2">
      <div className="ba">
        <img src={after} alt={afterAlt} />
        <img src={before} alt={beforeAlt} style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
        <div className="divider" style={{ left: pos + '%' }} aria-hidden="true" />
        <span className="lbl" style={{ left: 14, background: 'var(--bg)' }}>{beforeLabel}</span>
        <span className="lbl" style={{ right: 14, background: 'var(--accent)', color: 'var(--accent-ink)' }}>{afterLabel}</span>
      </div>
      <label htmlFor="ba-range" className="sr-only">Compare before and after</label>
      <input id="ba-range" className="range" type="range" min="0" max="100" value={pos} onChange={(e) => setPos(Number(e.target.value))} />
    </div>
  );
}
