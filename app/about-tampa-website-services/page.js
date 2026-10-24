import Link from 'next/link';
import { CtaBand } from '@/components/Blocks';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'About Tampa Website Services, Ybor City',
  description: 'Tampa Website Services is a Ybor City web design and AI company led by Manny Potter, with 15+ years building websites for Tampa Bay businesses.',
  alternates: { canonical: '/about-tampa-website-services' },
};

const VALUES = [
  ['Straight answers', 'Clear prices, plain language and a written quote before anything starts.'],
  ['Built to work', 'Every site has one job: turn visitors into calls, bookings and customers.'],
  ['Accessible by default', 'WCAG 2.2 AA on every build, because every visitor counts.'],
  ['Local', 'Based in Ybor City. We know Tampa Bay businesses because we are one.'],
];

export default function About() {
  return (
    <>
      <section className="gridbg bordered-b">
        <div className="container section row gap-12 center">
          <div className="grow stack gap-5">
            <p className="eyebrow">About</p>
            <h1 className="display">A Tampa web shop that builds sites that sell.</h1>
            <p className="lead">Tampa Website Services is a website and AI company in Ybor City. We build sites for local businesses, then add the AI that answers, follows up and books the work.</p>
            <div className="row gap-3">
              <a href={SITE.bookingUrl} className="btn btn-primary">Book a call with Manny</a>
              <a href={SITE.linkedin} className="btn btn-secondary">LinkedIn</a>
            </div>
          </div>
          <figure className="side" style={{ margin: 0, maxWidth: 420 }}>
            <img src="/images/manny-potter.jpg" alt="Manny Potter, founder of Tampa Website Services" width="900" height="900" style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--hairline)' }} />
            <figcaption className="small muted" style={{ marginTop: 10 }}>Manny Potter, founder</figcaption>
          </figure>
        </div>
      </section>

      <section className="container section stack gap-6 narrow" aria-labelledby="why-h">
        <h2 id="why-h" className="h2">Why I do this</h2>
        {/* TODO: replace with Manny's own paragraphs */}
        <p className="muted" style={{ fontSize: 17 }}>For more than 15 years I&apos;ve built websites for Tampa Bay businesses. The pattern never changes: the business owner is out doing the work, the phone rings, and nobody answers. That lead goes to whoever picks up first.</p>
        <p className="muted" style={{ fontSize: 17 }}>So I build sites that don&apos;t just look good. They answer questions, text back missed calls and put jobs on the calendar while you&apos;re busy. That&apos;s the whole idea behind Tampa Website Services.</p>
      </section>

      <section className="band" aria-labelledby="stats-h">
        <div className="container section stack gap-8">
          <h2 id="stats-h" className="sr-only">By the numbers</h2>
          <div className="grid" style={{ '--min': '200px', gap: 24 }}>
            {[['15+', 'years building websites'], ['200+', 'websites launched'], ['175+', 'Tampa Bay businesses served'], ['Ybor City', 'home base']].map(([n, l]) => (
              <div key={l} className="card-raised"><p className="stat accent">{n}</p><p className="small muted" style={{ marginTop: 8 }}>{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section stack gap-8" aria-labelledby="val-h">
        <h2 id="val-h" className="h2">How we work</h2>
        <ul className="list-clean grid" style={{ '--min': '240px' }}>
          {VALUES.map(([t, d]) => <li key={t} className="card"><p style={{ fontWeight: 600, fontSize: 17 }}>{t}</p><p className="small muted" style={{ marginTop: 6 }}>{d}</p></li>)}
        </ul>
        <Link href="/work" className="textlink">See our work →</Link>
      </section>

      <CtaBand title="Let's see what your site is missing." text="Run the free audit or book a call with Manny." />
    </>
  );
}
