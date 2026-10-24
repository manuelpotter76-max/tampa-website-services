import { SITE } from '@/lib/site';
import { INDUSTRIES } from '@/lib/industries';
import { POSTS } from '@/lib/posts';

export default function sitemap() {
  const base = SITE.url.replace(/\/$/, '');
  const paths = ['', '/web-design-services-tampa', '/industries', '/pricing', '/work', '/work/pims-inc', '/about-tampa-website-services', '/contact-tampa-web-designer', '/website-audit-review-request', '/web-design-faq-tampa', '/blogs', '/privacy-policy', '/terms', '/ai-data-policy', ...INDUSTRIES.map((i) => '/' + i.slug), ...POSTS.map((p) => '/blogs/post/' + p.slug)];
  const now = new Date();
  return paths.map((p) => ({ url: base + p, lastModified: now, changeFrequency: 'monthly', priority: p === '' ? 1 : 0.7 }));
}
