import Link from 'next/link';
import { Intro, CtaBand } from '@/components/Blocks';
import { POSTS, fmtDate } from '@/lib/posts';

export const metadata = {
  title: 'Blog: Web Design, AI and Local SEO Tips for Tampa Businesses',
  description: 'Practical notes on websites, AI follow-up and local SEO for Tampa Bay businesses.',
  alternates: { canonical: '/blogs' },
};

export default function Blogs() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <Intro eyebrow="Blog" title="Notes on sites that sell." text="Practical tips on websites, AI follow-up and local SEO for Tampa Bay businesses." />
      <section className="container section" aria-label="Posts">
        <ul className="list-clean grid" style={{ '--min': '300px', gap: 24 }}>
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={'/blogs/post/' + p.slug} className="card stack gap-3" style={{ color: 'var(--ink)', height: '100%' }}>
                <time className="tiny muted" dateTime={p.date}>{fmtDate(p.date)}</time>
                <h2 className="h4" style={{ fontSize: 21 }}>{p.title}</h2>
                <p className="small muted">{p.description}</p>
                <span className="small accent" style={{ marginTop: 'auto', fontWeight: 500 }}>Read →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand title="Want the short version?" text="Get your free AI audit in about 60 seconds." />
    </>
  );
}
