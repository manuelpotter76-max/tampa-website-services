import Link from 'next/link';
import { SITE } from '@/lib/site';
import { Icon } from './Logo';

export function CtaBand({ title, text, primary = { label: 'Get your AI audit', href: '/website-audit-review-request' }, secondary = { label: 'Book a call', href: SITE.bookingUrl } }) {
  return (
    <section className="gridbg bordered-t" aria-labelledby="cta-h">
      <div className="container section stack gap-5 center text-center" style={{ maxWidth: 800 }}>
        <h2 id="cta-h" className="h2">{title}</h2>
        {text && <p className="lead">{text}</p>}
        <div className="row gap-3" style={{ justifyContent: 'center' }}>
          <Link href={primary.href} className="btn btn-primary">{primary.label}</Link>
          {secondary && <a href={secondary.href} className="btn btn-secondary">{secondary.label}</a>}
        </div>
      </div>
    </section>
  );
}

export function Intro({ eyebrow, title, text, children }) {
  return (
    <section className="gridbg bordered-b">
      <div className="container stack gap-5" style={{ paddingTop: 'calc(var(--section) * 0.9)', paddingBottom: 'calc(var(--section) * 0.75)' }}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="display" style={{ maxWidth: 960 }}>{title}</h1>
        {text && <p className="lead" style={{ maxWidth: 680 }}>{text}</p>}
        {children}
      </div>
    </section>
  );
}

export function Faqs({ items, openFirst = true }) {
  return (
    <div className="stack gap-3">
      {items.map(([q, a], i) => (
        <details key={q} className="faq" open={openFirst && i === 0}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}

export function Steps({ items }) {
  return (
    <ol className="list-clean stack gap-3">
      {items.map(([t, d], i) => (
        <li key={t} className="card-raised card-tight row gap-4" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
          <span className="kicker-num" style={{ paddingTop: 2 }}>{String(i + 1).padStart(2, '0')}</span>
          <span><strong style={{ display: 'block' }}>{t}</strong><span className="small muted">{d}</span></span>
        </li>
      ))}
    </ol>
  );
}

export function Check({ children }) {
  return (
    <li className="row gap-3" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg)', border: '1px solid var(--hairline)', fontSize: 15, lineHeight: 1.45 }}>
      <span style={{ flex: '0 0 auto', paddingTop: 1 }}><Icon name="check" size={18} /></span><span>{children}</span>
    </li>
  );
}

export function Quote({ text, by, large = false }) {
  return (
    <blockquote style={{ margin: 0, fontSize: large ? 'clamp(22px, 2.6vw, 32px)' : 17, lineHeight: large ? 1.35 : 1.6, fontWeight: large ? 500 : 400, letterSpacing: large ? '-0.015em' : 0 }}>
      “{text}”
      <span className="small muted" style={{ display: 'block', marginTop: large ? 16 : 8, fontWeight: 500, letterSpacing: 0 }}>{by}</span>
    </blockquote>
  );
}
