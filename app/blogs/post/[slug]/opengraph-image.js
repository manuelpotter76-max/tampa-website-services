import { ogCard, OG_SIZE } from '@/lib/og';
import { POSTS, postBySlug, fmtDate } from '@/lib/posts';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Tampa Website Services blog post';

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }) {
  const { slug } = await params;
  const p = postBySlug(slug);
  return ogCard({ eyebrow: 'Blog', title: p ? p.title : 'Tampa Website Services blog', sub: p ? 'By Manny Potter · ' + fmtDate(p.date) : null });
}
