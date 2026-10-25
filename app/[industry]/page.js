import Link from 'next/link';
import { notFound } from 'next/navigation';
import { INDUSTRIES, industryBySlug } from '@/lib/industries';
import { SITE, telHref } from '@/lib/site';
import { QUOTES } from '@/lib/work';
import { CtaBand, Faqs, Steps, Check, Quote } from '@/components/Blocks';

export const dynamicParams = false;
export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ industry: i.slug }));
}

export async function generateMetadata({ params }) {
  const { industry } = await params;
  const p = industryBySlug(industry);
  if (!p) return {};
  return { title: { absolute: p.title }, description: p.description, alternates: { canonical: '/' + p.slug } };
}

const ACCESS = ['Text contrast 4.5:1 or better', 'Works with keyboard only', 'Screen reader labels on every control', 'Text resizes to 200% without breaking', 'Respects reduced-motion settings', 'Captions on video'];

function Figure({ p }) {
  if (p.checklist) {
    return (
      <figure className="side card-raised card-glow stack gap-3" style={{ margin: 0 }}>
        <figcaption className="row between tiny muted"><span>Accessibility checks · WCAG 2.2 AA</span><span className="tag">Example</span></figcaption>
        <ul className="list-clean stack gap-2">{ACCESS.map((c) => <Check key={c}>{c}</Check>)}</ul>
        <p className="tiny muted">Checked on every page before launch.</p>
      </figure>
    );
  }
  if (!p.fig) return null;
  return (
    <figure className="side card-raised card-glow stack gap-3" style={{ margin: 0 }}>
      <figcaption className="row between tiny muted"><span>{p.fig.label}</span><span className="tag">Example</span></figcaption>
      {p.fig.bubbles.map(([k, t], i) => <div key={i} className={'bubble ' + (k === 'ai' ? 'ai' : 'me')}>{t}</div>)}
      <p className="tiny muted">{p.fig.note}</p>
    </figure>
  );
}

export default async function IndustryPage({ params }) {
  const { industry } = await params;
  const p = industryBySlug(industry);
  if (!p) notFound();
  const proof = p.key === 'SmallBusiness' ? QUOTES.ysf : QUOTES.pims;
  const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <section className="gridbg bordered-b">
        <div className="container row gap-12 center" style={{ paddingTop: 'calc(var(--section) * 0.9)', paddingBottom: 'calc(var(--section) * 0.9)' }}>
          <div className="grow stack gap-5">
            <Link href="/industries" className="textlink" style={{ alignSelf: 'flex-start' }}>← All industries</Link>
            <p className="eyebrow">{p.eyebrow}</p>
            <h1 className="h1">{p.h1}</h1>
            <p className="tagline" style={{ maxWidth: 620 }}>{p.tag}</p>
            <p className="lead" style={{ maxWidth: 620 }}>{p.lead}</p>
            <div className="row gap-3">
              <Link href="/website-audit-review-request" className="btn btn-primary">{p.cta1}</Link>
              <a href={SITE.bookingUrl} className="btn btn-secondary">{p.cta2.label}</a>
            </div>
          </div>
          <Figure p={p} />
        </div>
      </section>

      <section className="container section stack gap-8" aria-labelledby="fail-h">
        <div className="stack gap-3 narrow">
          <h2 id="fail-h" className="h2">{p.probH}</h2>
          <p className="muted" style={{ fontSize: 17 }}>{p.probP}</p>
        </div>
        <div className="grid" style={{ '--min': '200px' }}>
          {p.probs.map(([t, d]) => <div key={t} className="card"><p className="h4" style={{ fontSize: 18 }}>{t}</p><p className="small muted" style={{ marginTop: 8 }}>{d}</p></div>)}
        </div>
      </section>

      <section className="band" aria-labelledby="build-h">
        <div className="container section stack gap-8">
          <h2 id="build-h" className="h2">{p.buildH}</h2>
          <div className="grid" style={{ '--min': '280px' }}>
            {p.builds.map(([tag, t, d, hi]) => (
              <div key={t} className={'card-raised' + (hi ? ' card-accent' : '')}>
                <span className="mono tiny" style={{ color: hi ? 'var(--accent)' : 'var(--ink-muted)' }}>{tag}</span>
                <p className="h4" style={{ fontSize: 18, marginTop: 6 }}>{t}</p>
                <p className="small muted" style={{ marginTop: 8 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {p.ada && (
        <section className="container" style={{ paddingTop: 'var(--section)' }} aria-labelledby="ada-h">
          <div className="card-raised card-accent card-glow row gap-8 center" style={{ padding: 32 }}>
            <div className="grow stack gap-3">
              <p className="eyebrow">ADA Title II</p>
              <h2 id="ada-h" className="h3">The accessibility deadline is coming.</h2>
              <p className="muted" style={{ fontSize: 17 }}>The Department of Justice requires state and local government websites to meet WCAG 2.1 AA. We build to WCAG 2.2 AA, which builds on it.</p>
              <p className="tiny muted">Deadlines as of October 2026, per the DOJ interim final rule. Not legal advice.</p>
            </div>
            <dl className="side stack gap-3" style={{ margin: 0 }}>
              <div className="card-tight" style={{ background: 'var(--bg)', border: '1px solid var(--hairline)' }}><dt className="tiny muted">Population 50,000 or more</dt><dd style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 600 }}>April 26, 2027</dd></div>
              <div className="card-tight" style={{ background: 'var(--bg)', border: '1px solid var(--hairline)' }}><dt className="tiny muted">Under 50,000 and special districts</dt><dd style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 600 }}>April 26, 2028</dd></div>
            </dl>
          </div>
        </section>
      )}

      {p.feature && (
        <section className="container" style={{ paddingTop: 'var(--section)' }} aria-labelledby="feat-h">
          <div className="card-raised card-accent card-glow row gap-8 center" style={{ padding: 32 }}>
            <div className="grow stack gap-3">
              <p className="eyebrow">{p.feature.eyebrow}</p>
              <h2 id="feat-h" className="h3">{p.feature.h}</h2>
              <p className="muted" style={{ fontSize: 17 }}>{p.feature.p}</p>
            </div>
            <ul className="side list-clean stack gap-2">{p.feature.items.map((x) => <Check key={x}>{x}</Check>)}</ul>
          </div>
        </section>
      )}

      <section className="container section row gap-12 center" aria-labelledby="area-h">
        <div className="side stack gap-3">
          <h2 id="area-h" className="h3">{p.areaH}</h2>
          <p className="muted" style={{ fontSize: 17 }}>{p.areaP}</p>
        </div>
        <div className="grow stack gap-6">
          {[p.chips, p.chips2].filter(Boolean).map(([label, items]) => (
            <div key={label} className="stack gap-3">
              <p className="small muted" style={{ fontWeight: 500 }}>{label}</p>
              <ul className="chips" aria-label={label}>{items.map((x) => <li key={x} className="chip">{x}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--section)' }} aria-label="What clients say">
        <div className="card stack gap-3" style={{ padding: 32 }}>
          <p className="eyebrow muted">What clients say</p>
          <Quote text={proof.text} by={proof.by} large />
          <Link href="/work" className="textlink" style={{ alignSelf: 'flex-start' }}>See our work →</Link>
        </div>
      </section>

      <section className="band">
        <div className="container section row gap-12">
          <div className="side stack gap-5">
            <h2 className="h3">How we build it</h2>
            <Steps items={p.steps} />
          </div>
          <div className="grow stack gap-5">
            <h2 className="h3">{p.faqH}</h2>
            <Faqs items={p.faqs} />
            <p className="small muted">More answers on our <Link href="/web-design-faq-tampa">FAQ page</Link>, or see <Link href="/pricing">pricing</Link>.</p>
          </div>
        </div>
      </section>

      <CtaBand title={p.endH} text={p.endP} />
    </>
  );
}
