import { ogCard, OG_SIZE } from '@/lib/og';
import { INDUSTRIES, industryBySlug } from '@/lib/industries';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Tampa Website Services industry page';

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ industry: i.slug }));
}

export default async function Image({ params }) {
  const { industry } = await params;
  const p = industryBySlug(industry);
  return ogCard({ eyebrow: p ? p.card + ' websites' : 'Websites + AI systems', title: p ? p.h1 : 'Tampa Website Services', sub: p ? p.cardLine : null });
}
