import AuditForm from '@/components/AuditForm';
import { Faqs, CtaBand } from '@/components/Blocks';

export const metadata = {
  title: 'Free AI Website Audit',
  description: 'Get a free score of your website in about 60 seconds: speed, mobile, SEO, trust and missed leads, with a plain-English list of fixes.',
  alternates: { canonical: '/website-audit-review-request' },
};

const WHAT = [
  ['Speed', 'How fast your site loads on a phone, measured by Google.'],
  ['Mobile', 'Whether it works and reads well on a small screen.'],
  ['SEO', 'Titles, descriptions, headings and local business data.'],
  ['Trust', 'Security, reviews and the signals buyers look for.'],
  ['Missed leads', 'Click-to-call, forms, chat and booking. The ways a visitor turns into a customer.'],
];
const FAQ = [
  ['Is it really free?', 'Yes. No card, no call required. You get your score on the spot.'],
  ['What do you do with my site address?', 'We run it through Google PageSpeed and look at the public page, the same way a visitor would. We save the result so we can follow up if you ask us to.'],
  ['Why is my score low when my site looks fine?', 'Looks and results are different things. A site can look great and still load slowly on phones or make it hard to call. The findings list tells you exactly what to fix.'],
  ['Can you fix what it finds?', 'Yes, that is what we do. Book a call and we will walk through the report together.'],
];

export default function Audit() {
  return (
    <>
      <section className="gridbg bordered-b">
        <div className="container section stack gap-6" style={{ maxWidth: 900 }}>
          <p className="eyebrow">Free AI audit</p>
          <h1 className="display">How many leads is your site losing?</h1>
          <p className="lead">Enter your website. In about 60 seconds you get a score and a plain-English list of what to fix.</p>
          <div className="card-raised card-glow" style={{ padding: 28 }}><AuditForm id="page-audit" full /></div>
        </div>
      </section>
      <section className="container section stack gap-8" aria-labelledby="what-h">
        <h2 id="what-h" className="h2">What we check</h2>
        <ul className="list-clean grid" style={{ '--min': '220px' }}>
          {WHAT.map(([t, d]) => <li key={t} className="card"><p style={{ fontWeight: 600, fontSize: 17 }}>{t}</p><p className="small muted" style={{ marginTop: 6 }}>{d}</p></li>)}
        </ul>
      </section>
      <section className="band" aria-labelledby="afaq-h">
        <div className="container section stack gap-6 narrow">
          <h2 id="afaq-h" className="h2">Questions</h2>
          <Faqs items={FAQ} />
        </div>
      </section>
      <CtaBand title="Rather just talk?" text="Book a short call and we'll look at your site together." primary={{ label: 'See pricing', href: '/pricing' }} />
    </>
  );
}
