import Link from 'next/link';
import { WORK } from '@/lib/work';
import { Intro, CtaBand, Quote } from '@/components/Blocks';

export const metadata = {
  title: 'Our Work: Tampa Website Design Portfolio',
  description: 'Real Tampa Bay websites with real client quotes: PIMS Inc., Your Sales Floor and Blogs on Tap.',
  alternates: { canonical: '/work' },
};

export default function Work() {
  return (
    <>
      <Intro eyebrow="Our work" title="Real sites. Real clients. Real quotes." text="Every project here is a real business, and every quote comes from the person who signed off on the work." />
      <section className="container section stack" style={{ gap: 'var(--section)' }} aria-label="Projects">
        {WORK.map((w, i) => (
          <article key={w.id} className="row gap-12 center" style={{ flexDirection: i % 2 ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
            <div className="grow rounded">
              {w.href ? <Link href={w.href}><img className="shot" src={w.img} alt={w.alt} width="1400" height="875" /></Link> : <img className="shot" src={w.img} alt={w.alt} width="1400" height="875" loading="lazy" />}
            </div>
            <div className="side stack gap-4">
              <p className="eyebrow muted">{w.facts}</p>
              <h2 className="h3">{w.name}</h2>
              <p className="muted" style={{ fontSize: 17 }}>{w.story}</p>
              {w.quote && <div className="card"><Quote text={w.quote.text} by={w.quote.by} /></div>}
              <div className="row gap-2">{w.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
              {w.href && <Link href={w.href} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Read the case study</Link>}
            </div>
          </article>
        ))}
      </section>
      <CtaBand title="Your business could be next." text="Start with a free score of your current site. About 60 seconds, no call required." />
    </>
  );
}
