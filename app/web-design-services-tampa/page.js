import Link from 'next/link';
import { Intro, CtaBand, Steps } from '@/components/Blocks';

export const metadata = {
  title: 'Web Design Services Tampa: Websites, AI Automation and Growth Systems',
  description: 'Tampa web design, AI automation and growth systems: custom websites, AI concierge chat, missed-call text-back, lead follow-up, reviews, local SEO and Google Ads.',
  alternates: { canonical: '/web-design-services-tampa' },
};

const SITE_ITEMS = ['Custom design', 'Redesigns', 'Conversion-focused layouts', 'Fast page speed', 'SEO-ready structure', 'WCAG 2.2 AA accessible'];
const AI_ITEMS = [
  ['AI website concierge', 'Answers questions, quotes starting prices and books calls, day or night.'],
  ['Missed-call text-back', "Can't pick up? The caller gets a text in seconds."],
  ['Instant lead response', 'Every form fill gets a reply in minutes, not hours.'],
  ['Booking and lead qualification', "The right jobs land on your calendar. The wrong ones don't waste your time."],
];
const GROWTH_ITEMS = ['Lead follow-up', 'Review engine', 'CRM integrations', 'Funnel pages', 'Local SEO and content', 'Google Ads management'];
const STEPS = [['Audit', 'Run the free AI audit. We see where your site is leaking leads.'], ['Plan', 'A short call with Manny. You get a clear scope and a written quote.'], ['Build', 'You see progress on a live preview link, not a mystery box.'], ['Launch and grow', 'Go live, then keep improving with a monthly plan if you want one.']];

function Chips({ items }) {
  return <ul className="list-clean grid side" style={{ '--min': '150px', gap: 12, alignContent: 'center' }}>{items.map((x) => <li key={x} className="card-raised card-tight" style={{ fontSize: 15 }}>{x}</li>)}</ul>;
}

export default function Services() {
  return (
    <>
      <Intro eyebrow="Services" title="A website that works like a sales team." text="Three layers, built to work together. Start with the site, add the AI that answers for you, then the systems that keep leads coming back." />
      <section className="container section stack gap-6" aria-label="What we build">
        <article className="card row gap-8" style={{ padding: 32 }}>
          <div className="side stack gap-4">
            <span className="kicker-num">01 · THE SITE</span>
            <h2 className="h3">Website design and redesign</h2>
            <p className="muted" style={{ fontSize: 17 }}>Custom sites built to load fast, rank, and turn visitors into calls. New builds or a full redesign of what you have now.</p>
          </div>
          <Chips items={SITE_ITEMS} />
        </article>
        <article className="card card-accent card-glow row gap-8" style={{ padding: 32 }}>
          <div className="side stack gap-4">
            <span className="kicker-num">02 · THE AI</span>
            <h2 className="h3">AI automation systems</h2>
            <p className="muted" style={{ fontSize: 17 }}>The part that answers when you can&apos;t. These run on our own site, so you can try them before you buy.</p>
            <Link href="/#demos-h" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Try the live demos</Link>
          </div>
          <ul className="list-clean side stack gap-3">
            {AI_ITEMS.map(([t, d]) => <li key={t} className="card-raised card-tight"><p style={{ fontWeight: 600 }}>{t}</p><p className="small muted" style={{ marginTop: 4 }}>{d}</p></li>)}
          </ul>
        </article>
        <article className="card row gap-8" style={{ padding: 32 }}>
          <div className="side stack gap-4">
            <span className="kicker-num">03 · THE GROWTH</span>
            <h2 className="h3">Business growth systems</h2>
            <p className="muted" style={{ fontSize: 17 }}>The follow-up, reviews and traffic that keep the phone ringing after launch.</p>
            <Link href="/pricing" className="textlink">See monthly plans →</Link>
          </div>
          <Chips items={GROWTH_ITEMS} />
        </article>
      </section>
      <section className="band" aria-labelledby="how-h">
        <div className="container section stack gap-8">
          <h2 id="how-h" className="h2">How it works</h2>
          <div style={{ maxWidth: 760 }}><Steps items={STEPS} /></div>
        </div>
      </section>
      <CtaBand title="Not sure what you need?" text="Build your system on the pricing page and see a starting price in seconds." primary={{ label: 'Build your system', href: '/pricing' }} />
    </>
  );
}
