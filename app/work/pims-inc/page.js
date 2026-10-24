import Link from 'next/link';
import { BeforeAfter } from '@/components/Tools';
import { CtaBand, Quote } from '@/components/Blocks';
import { QUOTES } from '@/lib/work';

export const metadata = {
  title: 'PIMS Inc. Case Study: Medical Billing Website Redesign',
  description: 'How we rebuilt a 2016 desktop-only site for a Tampa medical billing company serving eight specialties, delivered on time and still running eight years later.',
  alternates: { canonical: '/work/pims-inc' },
};

const BUILT = [
  ['A page for every specialty', 'Eight specialty pages, so a radiologist lands on radiology billing, not a generic pitch.'],
  ['One login menu, three audiences', 'Patient bill pay, client portal and employee access under a single Login item.'],
  ['Services in tabs', 'Seven services in one tabbed block, each with a short pitch and its own page.'],
  ['Proof on the homepage', 'Named physician testimonials right where buyers decide.'],
  ['A clear, professional look', 'Bold headline, PIMS orange as the accent, plain navigation, fully responsive.'],
  ['Copy and on-site SEO', 'We wrote the copy and set up on-site SEO across the service and specialty pages.'],
];

export default function Pims() {
  return (
    <>
      <section className="gridbg bordered-b">
        <div className="container stack gap-5" style={{ paddingTop: 72, paddingBottom: 64 }}>
          <Link href="/work" className="textlink" style={{ alignSelf: 'flex-start' }}>← All work</Link>
          <p className="eyebrow">Case study · PIMS Inc.</p>
          <h1 className="h1" style={{ maxWidth: 920 }}>A 2016 desktop site, rebuilt for physicians, patients and staff.</h1>
          <dl className="grid" style={{ '--min': '200px', margin: '16px 0 0' }}>
            {[['Industry', 'Medical billing'], ['Location', 'Tampa, FL'], ['Launched', '2018, on time'], ['Our role', 'Design, copy, on-site SEO']].map(([k, v]) => (
              <div key={k} className="card" style={{ padding: '18px 20px' }}><dt className="tiny muted">{k}</dt><dd style={{ margin: '6px 0 0', fontSize: 17, fontWeight: 500 }}>{v}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container stack gap-5" style={{ paddingTop: 'var(--section)', paddingBottom: 32 }} aria-labelledby="ba-h">
        <div className="row between gap-3" style={{ alignItems: 'flex-end' }}>
          <h2 id="ba-h" className="h3">Before and after</h2>
          <p className="small muted">Drag the slider to compare.</p>
        </div>
        <BeforeAfter before="/images/pims-before.jpg" after="/images/pims-after.jpg" beforeAlt="PIMS homepage before, in 2016" afterAlt="PIMS homepage after the 2018 rebuild" beforeLabel="Before · 2016" afterLabel="After · 2018" />
      </section>

      <section className="container row gap-12" style={{ paddingTop: 32, paddingBottom: 'var(--section)' }}>
        <div className="grow stack gap-12">
          <div className="stack gap-3">
            <h2 className="h4" style={{ fontSize: 28 }}>The client</h2>
            <p className="muted" style={{ fontSize: 17 }}>PIMS handles billing, coding, compliance and practice management for medical practices and labs. They&apos;ve been in the business since 1976 and run their whole team out of Tampa. Their buyers are specialists handing over their revenue, so trust is the whole sale.</p>
          </div>
          <div className="stack gap-3">
            <h2 className="h4" style={{ fontSize: 28 }}>The challenge</h2>
            <p className="muted" style={{ fontSize: 17 }}>The old site couldn&apos;t keep up. Built in 2016 as a fixed-width desktop page, it looked dated and didn&apos;t work on phones. And it had to serve three very different people at once: a physician comparing billing companies, a patient who just wants to pay a bill, and a client or employee who needs to log in.</p>
          </div>
          <div className="stack gap-4">
            <h2 className="h4" style={{ fontSize: 28 }}>What we built</h2>
            <ol className="list-clean grid" style={{ '--min': '260px' }}>
              {BUILT.map(([t, d], i) => (
                <li key={t} className="card"><span className="kicker-num">{String(i + 1).padStart(2, '0')}</span><p style={{ margin: '8px 0 4px', fontSize: 17, fontWeight: 600 }}>{t}</p><p className="small muted">{d}</p></li>
              ))}
            </ol>
          </div>
        </div>
        <aside className="side stack gap-3" style={{ flex: '1 1 300px' }}>
          <img src="/images/pims-mobile.jpg" alt="PIMS homepage on a phone, with a floating Contact us button" width="992" height="1802" loading="lazy" style={{ width: '100%', maxWidth: 320, borderRadius: 'var(--radius-lg)', border: '1px solid var(--hairline)' }} />
          <p className="small muted" style={{ maxWidth: 320 }}>On phones, a floating Contact us button keeps the next step one tap away.</p>
        </aside>
      </section>

      <section className="band" aria-labelledby="res-h">
        <div className="container section stack gap-8">
          <h2 id="res-h" className="h3">Results</h2>
          <div className="grid" style={{ '--min': '300px', gap: 24 }}>
            <div className="card-raised"><p className="stat accent">On time</p><p className="muted" style={{ marginTop: 12 }}>PIMS added changes and updates during the build, and the site still launched on schedule.</p></div>
            <div className="card-raised"><p className="stat accent">8 years</p><p className="muted" style={{ marginTop: 12 }}>Still live and still the front door for physicians, patients and clients.</p></div>
          </div>
          <div style={{ maxWidth: 900 }}><Quote text={QUOTES.pims.text} by={QUOTES.pims.by} large /></div>
        </div>
      </section>

      <CtaBand title="Outgrown your site too?" text="Get a free score of your current site in about 60 seconds." secondary={{ label: 'See more work', href: '/work' }} />
    </>
  );
}
