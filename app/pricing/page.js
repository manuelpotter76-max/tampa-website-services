import { Configurator, FollowupCalculator } from '@/components/Tools';
import { CtaBand } from '@/components/Blocks';
import { PRICES, money } from '@/lib/site';

export const metadata = {
  title: 'Website Pricing: Tampa Web Design and AI Packages',
  description: 'Clear prices for Tampa websites and AI systems. Starter from $1,500, Growth from $3,500, AI Growth System from $7,500, plus monthly care, SEO and ads plans.',
  alternates: { canonical: '/pricing' },
};

const PKGS = [
  { name: 'Starter Website', who: 'For new businesses, contractors and consultants.', price: PRICES.starter, items: ['Custom mobile-friendly design', 'Up to 5 core pages', 'Contact forms', 'Basic SEO and speed tuning', 'SSL security'] },
  { name: 'Growth Website', who: 'For established businesses focused on leads.', price: PRICES.growth, items: ['Fully custom, conversion-focused design', 'Local SEO and analytics', 'CRM integrations and call tracking', 'Advanced forms and lead capture', 'Blog'] },
  { name: 'AI Growth System', who: 'For businesses ready to scale and stop doing follow-up by hand.', price: PRICES.ai, hi: true, items: ['Custom growth-focused website', 'AI concierge chat', 'Automated lead follow-up, email and SMS', 'Booking and CRM automation', 'Analytics dashboard and growth consults'] },
];

export default function Pricing() {
  return (
    <>
      <section className="gridbg bordered-b">
        <div className="container section row gap-12" style={{ alignItems: 'flex-start' }}>
          <div className="side stack gap-5">
            <p className="eyebrow">Pricing</p>
            <h1 className="h1">Clear prices. No surprises.</h1>
            <p className="lead">Pick what you need and see your starting price right now. Projects can be split into milestone payments.</p>
          </div>
          <div className="grow card-raised card-glow stack gap-5" style={{ padding: 28 }}>
            <h2 className="h4" style={{ fontSize: 24 }}>Build your system</h2>
            <Configurator />
          </div>
        </div>
      </section>

      <section className="container section stack gap-8" aria-labelledby="pk-h">
        <h2 id="pk-h" className="h2">Website packages</h2>
        <div className="grid" style={{ '--min': '300px', gap: 24 }}>
          {PKGS.map((p) => (
            <article key={p.name} className={'stack gap-4 ' + (p.hi ? 'card-raised card-accent card-glow' : 'card')} style={{ padding: 28 }}>
              <div className="row between center gap-2"><h3 className="h4" style={{ fontSize: 24 }}>{p.name}</h3>{p.hi && <span className="tag">Website + AI</span>}</div>
              <p className="small muted">{p.who}</p>
              <p className="row gap-2" style={{ alignItems: 'baseline' }}><span className="small muted">Starting at</span><span className={'stat' + (p.hi ? ' accent' : '')} style={{ fontSize: 44 }}>{money(p.price)}</span></p>
              <ul className="list-clean stack gap-2" style={{ fontSize: 15 }}>{p.items.map((x) => <li key={x}>{x}</li>)}</ul>
            </article>
          ))}
        </div>
        <p className="small muted" style={{ maxWidth: 820 }}>Final price depends on page count, custom features, e-commerce, booking, CRM and other integrations, SEO needs and content. You get a written quote before any work starts.</p>
      </section>

      <section className="band" aria-labelledby="mo-h">
        <div className="container section stack gap-8">
          <h2 id="mo-h" className="h2">Monthly plans</h2>
          <div className="grid" style={{ '--min': '280px', gap: 24 }}>
            {PRICES.plans.map((p) => (
              <article key={p.id} className="card-raised stack gap-3">
                <h3 className="h4">{p.name}</h3>
                <p><span className="stat" style={{ fontSize: 36 }}>{money(p.price)}</span><span className="muted">/mo</span></p>
                <p className="small muted">{p.desc}</p>
              </article>
            ))}
          </div>
          <p className="small muted">All monthly prices are starting points.</p>
        </div>
      </section>

      <section className="container section row gap-12 center" aria-labelledby="calc-h">
        <div className="side stack gap-4">
          <p className="eyebrow">Worth it?</p>
          <h2 id="calc-h" className="h2">What slow follow-up costs you</h2>
          <p className="muted" style={{ fontSize: 17 }}>Put in your own numbers. This is your math, not ours.</p>
        </div>
        <div className="grow card" style={{ padding: 28 }}><FollowupCalculator /></div>
      </section>

      <CtaBand title="Get a written quote." text="Start with the free audit, or book a call and we'll scope it together." />
    </>
  );
}
