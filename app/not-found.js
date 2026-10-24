import Link from 'next/link';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className="gridbg">
      <div className="container section stack gap-5 center text-center" style={{ maxWidth: 700, minHeight: '50vh', justifyContent: 'center' }}>
        <p className="eyebrow">404</p>
        <h1 className="h1">This page took the day off.</h1>
        <p className="lead">The link may be old. Try one of these instead.</p>
        <div className="row gap-3" style={{ justifyContent: 'center' }}>
          <Link href="/" className="btn btn-primary">Home</Link>
          <Link href="/web-design-services-tampa" className="btn btn-secondary">Services</Link>
          <Link href="/contact-tampa-web-designer" className="btn btn-secondary">Contact</Link>
        </div>
      </div>
    </section>
  );
}
