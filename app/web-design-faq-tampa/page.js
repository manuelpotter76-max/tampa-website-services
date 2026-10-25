import { Intro, Faqs, CtaBand } from '@/components/Blocks';

export const metadata = {
  title: 'Web Design FAQ: Tampa Website Questions Answered',
  description: 'Answers about Tampa web design: cost, timelines, AI chat, missed-call text-back, SEO, accessibility, hosting and what happens after launch.',
  alternates: { canonical: '/web-design-faq-tampa' },
};

const GROUPS = [
  ['Cost and timing', [
    ['How much does a website cost?', 'Our Starter Website starts at $1,500, the Growth Website at $3,500 and the AI Growth System at $7,500. Final price depends on pages, features and integrations, and you get a written quote before any work starts.'],
    ['Can I pay in parts?', 'Yes. Projects can be split into milestone payments.'],
    ['How long does a build take?', 'It depends on the size of the site and how fast content comes together. You get a timeline with your quote, and you can watch progress on a live preview link the whole way.'],
    ['Are there monthly fees?', 'Only if you want them. Website Care starts at $97 a month, Local SEO at $497 and Ads Growth at $997.'],
  ]],
  ['AI and automation', [
    ['What does the AI concierge do?', 'It answers common questions, shares starting prices and books calls on your site, day or night. It always says it is an AI and hands off to a person when it should.'],
    ['What is missed-call text-back?', 'When you cannot pick up, the caller gets a text in seconds so they do not move on to the next company.'],
    ['Will the AI say something wrong about my business?', 'We set it up with your real services, prices and rules, and we test it before launch. You can review conversations and we adjust it as needed.'],
    ['Can I try it first?', 'Yes. The concierge running on this site is the same kind we build. Click the chat button and ask it anything.'],
  ]],
  ['SEO, accessibility and ownership', [
    ['Will my site show up on Google?', 'Every site ships with on-site SEO: clean titles, descriptions, headings, local business data and fast load times. Ongoing local SEO is available as a monthly plan.'],
    ['Is the site accessible?', 'Yes. We build to WCAG 2.2 AA, with real contrast, keyboard support, screen reader labels and large touch targets.'],
    ['Do I own my site?', 'Yes. Your content, your domain and your data are yours.'],
    ['Do you work outside Tampa?', 'Yes. We are based in Tampa and work with businesses across Tampa Bay and Florida.'],
  ]],
];

export default function Faq() {
  const all = GROUPS.flatMap(([, items]) => items);
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: all.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Intro eyebrow="FAQ" title="Straight answers." text="The questions we hear most. Don't see yours? Ask the AI concierge or give us a call." />
      <section className="container section stack gap-12 narrow">
        {GROUPS.map(([h, items]) => (
          <div key={h} className="stack gap-4">
            <h2 className="h3">{h}</h2>
            <Faqs items={items} openFirst={false} />
          </div>
        ))}
      </section>
      <CtaBand title="Still have questions?" text="Book a short call. No pitch, just answers." />
    </>
  );
}
