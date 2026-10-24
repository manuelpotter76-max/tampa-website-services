import { Intro, CtaBand } from '@/components/Blocks';

export const metadata = {
  title: 'Insights: Web Design, AI and Local SEO Tips for Tampa Businesses',
  description: 'Practical notes on websites, AI follow-up and local SEO for Tampa Bay businesses.',
  alternates: { canonical: '/blogs' },
};

export default function Blogs() {
  return (
    <>
      <Intro eyebrow="Insights" title="Notes on sites that sell." text="Practical tips on websites, AI follow-up and local SEO for Tampa Bay businesses. New posts are on the way." />
      <section className="container section narrow stack gap-4">
        <div className="card stack gap-3">
          <h2 className="h4">First posts coming soon</h2>
          <p className="muted">In the meantime, run the free audit to see where your own site stands.</p>
        </div>
      </section>
      <CtaBand title="Want the short version?" text="Get your free AI audit in about 60 seconds." />
    </>
  );
}
