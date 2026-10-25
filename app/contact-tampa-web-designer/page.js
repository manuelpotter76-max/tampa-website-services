import ContactForm from '@/components/ContactForm';
import { Icon } from '@/components/Logo';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'Contact a Tampa Web Designer',
  description: 'Talk to Tampa Website Services in Tampa, Florida. Call 813-816-2669, book a call, or send a message and Manny gets back to you within one business day.',
  alternates: { canonical: '/contact-tampa-web-designer' },
};

export default function Contact() {
  return (
    <section className="gridbg">
      <div className="container section row gap-12" style={{ alignItems: 'flex-start' }}>
        <div className="side stack gap-6">
          <p className="eyebrow">Contact</p>
          <h1 className="h1">Let&apos;s talk about your site.</h1>
          <p className="lead">Call, book a time, or send a note. You&apos;ll hear back within one business day.</p>
          <ul className="list-clean stack gap-3">
            <li><a href={SITE.phoneHref} className="card-raised card-tight row gap-3 center" style={{ color: 'var(--ink)' }}><Icon name="phone" /> <span><strong style={{ display: 'block' }}>{SITE.phone}</strong><span className="small muted">Call or text</span></span></a></li>
            <li><a href={SITE.bookingUrl} className="card-raised card-tight row gap-3 center" style={{ color: 'var(--ink)' }}><Icon name="calendar" /> <span><strong style={{ display: 'block' }}>Book a call</strong><span className="small muted">Pick a time that works</span></span></a></li>
            {SITE.email && <li><a href={'mailto:' + SITE.email} className="card-raised card-tight row gap-3 center" style={{ color: 'var(--ink)' }}><Icon name="mail" /> <span><strong style={{ display: 'block' }}>{SITE.email}</strong><span className="small muted">Email</span></span></a></li>}
            <li className="card-raised card-tight row gap-3 center"><Icon name="pin" /> <span><strong style={{ display: 'block' }}>{SITE.location}</strong></span></li>
          </ul>
        </div>
        <div className="grow card-raised" style={{ padding: 28 }}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
