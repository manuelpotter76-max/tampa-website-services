'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Mark, Icon } from './Logo';
import { NAV } from '@/lib/site';

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [path]);
  const current = (href) => (path === href || (href !== '/' && path.startsWith(href + '/')) ? 'page' : undefined);

  return (
    <header className="site-header">
      <div className="container">
        <nav className="nav" aria-label="Main">
          <Link href="/" className="brand" aria-label="Tampa Website Services home">
            <Mark size={36} />
            <span className="brand-name">Tampa Website Services</span>
          </Link>
          <div className="nav-links">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={current(n.href)}>{n.label}</Link>
            ))}
            <Link href="/website-audit-review-request" className="btn btn-primary btn-sm">Get your AI audit</Link>
          </div>
          <button type="button" className="menu-btn" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </nav>
        <div id="mobile-menu" className={'mobile-menu' + (open ? ' open' : '')}>
          <Link className="m-link" href="/">Home</Link>
          {NAV.map((n) => (
            <Link key={n.href} className="m-link" href={n.href} aria-current={current(n.href)}>{n.label}</Link>
          ))}
          <Link className="m-link" href="/contact-tampa-web-designer">Contact</Link>
          <Link href="/website-audit-review-request" className="btn btn-primary" style={{ width: '100%', marginTop: 16 }}>Get your AI audit</Link>
        </div>
      </div>
    </header>
  );
}
