import Link from 'next/link';
import { INDUSTRIES } from '@/lib/industries';
import { Intro, CtaBand, Check } from '@/components/Blocks';

export const metadata = {
  title: 'Industries We Build Websites For',
  description: 'Websites with AI built in for HVAC, plumbing, roofing, electricians, pest control, lawn care, med spas, local businesses and Florida government.',
  alternates: { canonical: '/industries' },
};

const ORDER = ['hvac-website-design-tampa', 'plumbing-website-design-tampa', 'roofing-website-design-tampa', 'electrician-website-design-tampa', 'pest-control-website-design-tampa', 'lawn-care-website-design-tampa', 'med-spa-website-design-tampa', 'small-business-website-design-in-tampa-bay'];

export default function Industries() {
  const list = ORDER.map((s) => INDUSTRIES.find((i) => i.slug === s));
  return (
    <>
      <Intro eyebrow="Industries" title="Built for businesses that live on the phone." text="When you're on a job, the next customer is calling someone else. We build sites that answer, follow up and book the work while your hands are full." />

      <section className="container section stack gap-8" aria-labelledby="who-h">
        <h2 id="who-h" className="h3">Who we build for</h2>
        <div className="grid" style={{ '--min': '260px' }}>
          {list.map((i) => (
            <Link key={i.slug} href={'/' + i.slug} className="card stack gap-2" style={{ color: 'var(--ink)' }}>
              <span style={{ fontSize: 20, fontWeight: 600 }}>{i.card}</span>
              <span className="small muted">{i.cardLine}</span>
              <span className="small accent" style={{ marginTop: 6, fontWeight: 500 }}>{i.card} websites →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="band" aria-labelledby="gov-h">
        <div className="container section row gap-12 center">
          <div className="grow stack gap-4">
            <p className="eyebrow">Government</p>
            <h2 id="gov-h" className="h2">Accessible by design, not as an afterthought.</h2>
            <p className="muted" style={{ fontSize: 17 }}>Cities, counties and agencies serve everyone. Every site we build follows WCAG 2.2 AA from the first line of code, the same standard this site is built to.</p>
            <Link href="/Florida-Government-Website-Design-Services" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Government websites</Link>
          </div>
          <ul className="side list-clean stack gap-2">
            <Check>Text contrast that passes for every visitor</Check>
            <Check>Full keyboard and screen reader support</Check>
            <Check>Large touch targets and reduced-motion support</Check>
            <Check>Plain-language copy people can actually follow</Check>
          </ul>
        </div>
      </section>

      <CtaBand title="Don't see your industry?" text="If your phone rings, we can help. Start with a free score of your site." />
    </>
  );
}
