import { SITE } from '@/lib/site';

export default function robots() {
  const base = SITE.url.replace(/\/$/, '');
  return { rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }], sitemap: base + '/sitemap.xml' };
}
