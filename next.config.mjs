/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/services', destination: '/web-design-services-tampa', permanent: true },
      { source: '/about', destination: '/about-tampa-website-services', permanent: true },
      { source: '/contact', destination: '/contact-tampa-web-designer', permanent: true },
      { source: '/audit', destination: '/website-audit-review-request', permanent: true },
      { source: '/faq', destination: '/web-design-faq-tampa', permanent: true },
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/home-services-website-design-tampa', destination: '/small-business-website-design-in-tampa-bay', permanent: true },
      // Old Zoho blog tag, category, paging and feed URLs that Google still has indexed.
      { source: '/blogs/tag/:tag*', destination: '/blogs', permanent: true },
      { source: '/blogs/page/:n*', destination: '/blogs', permanent: true },
      { source: '/blogs/feed', destination: '/blogs', permanent: true },
      { source: '/blogs/:cat(tampa-web-design|small-business-web-design|website-conversion|website-tips|Uncategorized)', destination: '/blogs', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
