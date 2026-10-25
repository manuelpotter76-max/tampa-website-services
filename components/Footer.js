import Link from 'next/link';
import { Mark } from './Logo';
import { SITE, FOOTER_LINKS } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container" style={{ paddingTop: 48, paddingBottom: 32 }}>
        <div className="row gap-8 between">
          <div className="stack gap-3" style={{ maxWidth: 320 }}>
            <div className="row gap-3 center">
              <Mark size={32} />
              <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>{SITE.name}</span>
            </div>
            <p className="small muted">{SITE.tagline}</p>
          </div>
          <nav aria-label="Footer" className="footer-links">
            {FOOTER_LINKS.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
          </nav>
          <address className="stack gap-2 small muted" style={{ fontStyle: 'normal' }}>
            <span>{SITE.location}</span>
            <a href={SITE.phoneHref} style={{ color: 'var(--ink)' }}>{SITE.phone}</a>
            {SITE.email ? <a href={'mailto:' + SITE.email} style={{ color: 'var(--ink)' }}>{SITE.email}</a> : null}
            {SITE.hours ? <span>{SITE.hours}</span> : null}
          </address>
        </div>
        <p className="tiny muted" style={{ marginTop: 32 }}>© {new Date().getFullYear()} {SITE.name}</p>
      </div>
    </footer>
  );
}
