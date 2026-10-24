import Link from 'next/link';
import AuditForm from '@/components/AuditForm';
import Skyline from '@/components/Skyline';
import { ChatBox } from '@/components/Concierge';
import { FollowupCalculator, Configurator } from '@/components/Tools';
import { CtaBand, Quote } from '@/components/Blocks';
import { Icon } from '@/components/Logo';
import { SITE, telHref } from '@/lib/site';
import { WORK } from '@/lib/work';
import { INDUSTRIES } from '@/lib/industries';

export const metadata = {
  title: { absolute: 'Tampa Website Services | Websites + AI Systems in Tampa Bay' },
  description: 'Tampa web design with AI built in. Websites that answer, follow up and book the job. Try the free AI audit, the AI concierge and missed-call text-back right on the page.',
  alternates: { canonical: '/' },
};

const TILE_ORDER = ['hvac-website-design-tampa', 'plumbing-website-design-tampa', 'roofing-website-design-tampa', 'electrician-website-design-tampa', 'pest-control-website-design-tampa', 'lawn-care-website-design-tampa', 'med-spa-website-design-tampa', 'small-business-website-design-in-tampa-bay', 'Florida-Government-Website-Design-Services'];

function jsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE.name,
    url: SITE.url,
    telephone: '+1-813-816-2669',
    image: SITE.url + '/images/manny-potter.jpg',
    founder: { '@type': 'Person', name: SITE.founder, sameAs: [SITE.linkedin] },
    address: { '@type': 'PostalAddress', ...(SITE.street ? { streetAddress: SITE.street } : {}), addressLocality: 'Tampa', addressRegion: 'FL', addressCountry: 'US' },
    areaServed: ['Tampa', 'Brandon', 'Riverview', 'Valrico', 'Wesley Chapel', 'Lutz', 'Clearwater', 'St. Petersburg', 'Florida'],
    priceRange: '$$',
  };
}

export default function Home() {
  const tiles = TILE_ORDER.map((s) => INDUSTRIES.find((i) => i.slug === s)).filter(Boolean);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />

      <section className="gridbg bordered-b">
        <div className="container section row gap-12 center">
          <div className="grow stack gap-6">
            <p className="eyebrow">Websites + AI systems · Ybor City, Tampa</p>
            <h1 className="display" style={{ maxWidth: 760 }}>Websites that answer, follow up and book the job.</h1>
            <p className="lead" style={{ maxWidth: 600 }}>We build Tampa business websites with AI built in. Don&apos;t take our word for it. Audit your site, call our demo line, or ask the AI assistant, right here on this page.</p>
            <div style={{ maxWidth: 620 }}><AuditForm id="hero-audit" /></div>
          </div>
          <div className="side stack gap-4 center">
            <Skyline />
            <p className="pill"><span className="dot" aria-hidden="true" />We answer in under 5 minutes, because our AI does.</p>
          </div>
        </div>
      </section>

      <section className="container section stack gap-8" aria-labelledby="demos-h">
        <div className="stack gap-3 narrow">
          <p className="eyebrow">Try it, don&apos;t read about it</p>
          <h2 id="demos-h" className="h2">Everything we sell, working on this page.</h2>
        </div>
        <div className="grid" style={{ '--min': '320px', gap: 24 }}>
          <article className="card stack gap-4">
            <h3 className="h4">Call and hang up</h3>
            <p className="muted">Call our demo line. Nobody picks up. You get a text back in seconds, the same thing your customers would get when you&apos;re on a roof.</p>
            {SITE.demoPhone ? (
              <a href={telHref(SITE.demoPhone)} className="btn btn-secondary mono" style={{ marginTop: 'auto', justifyContent: 'flex-start', fontSize: 18 }}><Icon name="phone" color="#A78BFA" />{SITE.demoPhone}</a>
            ) : (
              <div className="card-tight muted small" style={{ marginTop: 'auto', background: 'var(--bg)', border: '1px solid var(--hairline)' }}>Demo line launching soon. Until then, <a href={SITE.bookingUrl}>book a call</a> and we&apos;ll show you live.</div>
            )}
          </article>
          <article className="card stack gap-4">
            <h3 className="h4">Ask the AI assistant</h3>
            <ChatBox compact />
          </article>
          <article className="card stack gap-4">
            <h3 className="h4">What slow follow-up costs you</h3>
            <FollowupCalculator />
          </article>
          <article className="card stack gap-4">
            <h3 className="h4">Build your system</h3>
            <p className="muted small">Start with a website. Add what you need. Watch the starting price update.</p>
            <Configurator compact />
            <Link href="/pricing" className="textlink">See full pricing →</Link>
          </article>
        </div>
      </section>

      <section className="band" aria-label="By the numbers">
        <div className="container grid" style={{ '--min': '200px', gap: 24, paddingTop: 48, paddingBottom: 48 }}>
          <div><p className="stat">15+</p><p className="muted" style={{ marginTop: 8 }}>years building Tampa websites</p></div>
          <div><p className="stat">200+</p><p className="muted" style={{ marginTop: 8 }}>websites launched</p></div>
          <div><p className="stat">175+</p><p className="muted" style={{ marginTop: 8 }}>clients served</p></div>
          <div><p className="stat accent">Ybor City</p><p className="muted" style={{ marginTop: 8 }}>home base, Tampa, FL</p></div>
        </div>
      </section>

      <section className="container section stack gap-8" aria-labelledby="work-h">
        <div className="row between gap-4" style={{ alignItems: 'flex-end' }}>
          <div className="stack gap-3">
            <p className="eyebrow">Recent work</p>
            <h2 id="work-h" className="h2">Real sites. Real clients.</h2>
          </div>
          <Link href="/work" className="textlink">See all work →</Link>
        </div>
        <div className="grid" style={{ '--min': '300px', gap: 24 }}>
          {WORK.map((w) => (
            <article key={w.id} className="card stack" style={{ padding: 0, overflow: 'hidden' }}>
              <img className="shot" src={w.img} alt={w.alt} loading="lazy" width="1400" height="875" />
              <div className="stack gap-3" style={{ padding: 24, flex: '1 1 auto' }}>
                <p className="eyebrow muted">{w.short}</p>
                <h3 className="h4" style={{ fontSize: 24 }}>{w.name}</h3>
                {w.quoteShort ? <Quote text={w.quoteShort.text} by={w.quoteShort.by} /> : <p className="muted">{w.story}</p>}
                <Link href={w.href || '/work'} className="textlink" style={{ marginTop: 'auto' }}>{w.href ? 'Read the case study →' : 'See the project →'}</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="band" aria-labelledby="ind-h">
        <div className="container section stack gap-8">
          <h2 id="ind-h" className="h2" style={{ maxWidth: 760 }}>Built for businesses that live on the phone.</h2>
          <div className="grid" style={{ '--min': '220px' }}>
            {tiles.map((t) => (
              <Link key={t.slug} href={'/' + t.slug} className="card-raised stack gap-2" style={{ color: 'var(--ink)', borderColor: t.key === 'Government' ? 'var(--accent)' : undefined }}>
                <span style={{ fontSize: 18, fontWeight: 600 }}>{t.card}</span>
                <span className="small muted">{t.cardLine}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container section row gap-12 center" aria-labelledby="about-h">
        <img src="/images/manny-potter.jpg" alt="Manny Potter, founder of Tampa Website Services" width="900" height="900" loading="lazy" style={{ flex: '0 1 380px', minWidth: 0, maxWidth: 380, width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} />
        <div className="grow stack gap-5">
          <p className="eyebrow">Meet the founder</p>
          <h2 id="about-h" className="h2">I&apos;m Manny Potter.</h2>
          <p className="lead" style={{ maxWidth: 600 }}>I&apos;ve been building websites for Tampa businesses for over fifteen years. Now every site I build comes with the AI that answers, follows up and books the job for you.</p>
          <div className="row gap-3">
            <Link href="/about-tampa-website-services" className="btn btn-primary">More about me</Link>
            <a href={SITE.linkedin} className="btn btn-secondary">Connect on LinkedIn</a>
          </div>
        </div>
      </section>

      <CtaBand title="See where your site is leaking leads." text="Free score in about 60 seconds. No call required." />
    </>
  );
}
