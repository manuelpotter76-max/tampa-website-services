import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CtaBand } from '@/components/Blocks';
import { POSTS, postBySlug, fmtDate } from '@/lib/posts';
import { SITE } from '@/lib/site';

export const dynamicParams = false;
export function generateStaticParams() { return POSTS.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) return {};
  return { title: p.title, description: p.description, alternates: { canonical: '/blogs/post/' + p.slug }, openGraph: { type: 'article', title: p.title, description: p.description, publishedTime: p.date } };
}

function Block({ b }) {
  const [t, v] = b;
  if (t === 'h2') return <h2>{v}</h2>;
  if (t === 'h3') return <h3>{v}</h3>;
  if (t === 'ul') return <ul>{v.map((x) => <li key={x}>{x}</li>)}</ul>;
  if (t === 'ol') return <ol>{v.map((x) => <li key={x}>{x}</li>)}</ol>;
  return <p>{v}</p>;
}

export default async function Post({ params }) {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) notFound();
  const ld = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.description, datePublished: p.date, author: { '@type': 'Person', name: SITE.founder }, publisher: { '@type': 'Organization', name: SITE.name }, mainEntityOfPage: SITE.url + '/blogs/post/' + p.slug };
  const more = POSTS.filter((x) => x.slug !== p.slug).slice(0, 3);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <article className="container section">
        <div className="prose">
          <Link href="/blogs" className="textlink">← All insights</Link>
          <h1 className="h1" style={{ margin: '24px 0 10px', color: 'var(--ink)' }}>{p.title}</h1>
          <p className="small">By {SITE.founder} · <time dateTime={p.date}>{fmtDate(p.date)}</time></p>
          {p.body.map((b, i) => <Block key={i} b={b} />)}
          <p style={{ marginTop: 28 }}><Link href="/website-audit-review-request" className="btn btn-primary">Get your free AI audit</Link></p>
        </div>
      </article>
      <section className="band" aria-labelledby="more-h">
        <div className="container section stack gap-6">
          <h2 id="more-h" className="h3">Keep reading</h2>
          <ul className="list-clean grid" style={{ '--min': '260px' }}>
            {more.map((m) => <li key={m.slug}><Link href={'/blogs/post/' + m.slug} className="card stack gap-2" style={{ color: 'var(--ink)', height: '100%' }}><span style={{ fontWeight: 600 }}>{m.title}</span><span className="small muted">{m.description}</span></Link></li>)}
          </ul>
        </div>
      </section>
      <CtaBand title="Want this done for you?" text="Book a short call and we'll look at your site together." />
    </>
  );
}
