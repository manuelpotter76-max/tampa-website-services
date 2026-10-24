import Link from 'next/link';
import { CtaBand } from '@/components/Blocks';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'About Tampa Website Services, Ybor City',
  description: 'Tampa Website Services is a Ybor City web design and AI company led by Manny Potter, with 15+ years in digital marketing, lead generation and SEO.',
  alternates: { canonical: '/about-tampa-website-services' },
};

const VALUES = [
  ['Straight answers', 'Clear prices, plain language and a written quote before anything starts.'],
  ['Built to work', 'Every site has one job: turn visitors into calls, bookings and customers.'],
  ['Accessible by default', 'WCAG 2.2 AA on every build, because every visitor counts.'],
  ['Local', 'Based in Ybor City. We know Tampa Bay businesses because we are one.'],
];

export default function About() {
  return (
    <>
      <section className="gridbg bordered-b">
        <div className="container section row gap-12 center">
          <div className="grow stack gap-5">
            <p className="eyebrow">About</p>
            <h1 className="display">A Tampa web shop that builds sites that sell.</h1>
            <p className="lead">Tampa Website Services is a website and AI company in Ybor City. We build sites for local businesses, then add the AI that answers, follows up and books the work.</p>
            <div className="row gap-3">
              <a href={SITE.bookingUrl} className="btn btn-primary">Book a call with Manny</a>
              <a href={SITE.linkedin} className="btn btn-secondary">LinkedIn</a>
            </div>
          </div>
          <figure className="side" style={{ margin: 0, maxWidth: 420 }}>
            <img src="/images/manny-potter.jpg" alt="Manny Potter, founder of Tampa Website Services" width="900" height="900" style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--hairline)' }} />
            <figcaption className="small muted" style={{ marginTop: 10 }}>Manny Potter, founder</figcaption>
          </figure>
        </div>
      </section>

      <section className="container section stack gap-6 narrow" aria-labelledby="why-h">
        <h2 id="why-h" className="h2">Why I do this</h2>
        <p className="muted" style={{ fontSize: 17 }}>I&apos;m a digital marketing professional with over 15 years of experience building strategies that help businesses grow, generate leads and increase revenue. My background covers digital advertising, lead generation, SEO, branding, marketing automation and performance analytics.</p>
        <ul className="list-clean row gap-2" aria-label="Industries I've worked in">
          {['Home improvement', 'Healthcare', 'Legal', 'Automotive', 'Home services'].map((x) => <li key={x} className="chip">{x}</li>)}
        </ul>
        <p className="muted" style={{ fontSize: 17 }}>Throughout my career I&apos;ve focused on combining creative marketing with data-driven decisions to deliver measurable results. I enjoy building marketing systems, improving processes, managing budgets and finding ways to make businesses more competitive and profitable.</p>
        <h3 className="h4" style={{ marginTop: 16 }}>Why I love marketing</h3>
        <p className="muted" style={{ fontSize: 17 }}>Marketing brings together creativity, strategy, technology and problem-solving. Every business has different challenges, and I enjoy figuring out what makes customers take action and turning that into campaigns that work. For me it&apos;s not about clicks or leads. It&apos;s about real growth you can measure.</p>
        <p className="muted" style={{ fontSize: 17 }}>What keeps me passionate is that it never stops changing. There&apos;s always something new to learn, a different approach to test or a better way to improve performance. I love taking an idea, building a strategy around it and watching it turn into something successful. Being creative while using data to make smarter decisions is what makes this exciting to me.</p>
      </section>

      <section className="band" aria-labelledby="stats-h">
        <div className="container section stack gap-8">
          <h2 id="stats-h" className="sr-only">By the numbers</h2>
          <div className="grid" style={{ '--min': '200px', gap: 24 }}>
            {[['15+', 'years in digital marketing'], ['200+', 'websites launched'], ['175+', 'Tampa Bay businesses served'], ['Ybor City', 'home base']].map(([n, l]) => (
              <div key={l} className="card-raised"><p className="stat accent">{n}</p><p className="small muted" style={{ marginTop: 8 }}>{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section stack gap-8" aria-labelledby="val-h">
        <h2 id="val-h" className="h2">How we work</h2>
        <ul className="list-clean grid" style={{ '--min': '240px' }}>
          {VALUES.map(([t, d]) => <li key={t} className="card"><p style={{ fontWeight: 600, fontSize: 17 }}>{t}</p><p className="small muted" style={{ marginTop: 6 }}>{d}</p></li>)}
        </ul>
        <Link href="/work" className="textlink">See our work →</Link>
      </section>

      <CtaBand title="Let's see what your site is missing." text="Run the free audit or book a call with Manny." />
    </>
  );
}
