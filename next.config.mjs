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
