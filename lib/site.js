// One place for business details.
export const SITE = {
  name: 'Tampa Website Services',
  tagline: 'Websites + AI systems, built in Ybor City.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tampawebsiteservices.com',
  phone: '813-816-2669',
  phoneHref: 'tel:+18138162669',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@tampawebsiteservices.com',
  legalName: 'The Potter Group, LLC',
  bookingUrl: 'https://tampawebsiteservices.zohobookings.com/#/4940624000000036032',
  linkedin: 'https://www.linkedin.com/in/manuelpotter',
  // Public location shown on the site. Street address is intentionally not shown.
  location: 'Tampa, Florida',
  city: 'Tampa',
  region: 'FL',
  neighborhood: 'Ybor City',
  founder: 'Manny Potter',
};

export const telHref = (num) => 'tel:+1' + String(num).replace(/\D/g, '').replace(/^1/, '');

export const NAV = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/web-design-services-tampa' },
  { label: 'Industries', href: '/industries' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about-tampa-website-services' },
  { label: 'Blog', href: '/blogs' },
];

export const FOOTER_LINKS = [
  { label: 'Blog', href: '/blogs' },
  { label: 'FAQ', href: '/web-design-faq-tampa' },
  { label: 'Contact', href: '/contact-tampa-web-designer' },
  { label: 'Privacy policy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms' },
  { label: 'How we handle your data with AI', href: '/ai-data-policy' },
];

export const PRICES = {
  starter: 1500,
  growth: 3500,
  ai: 7500,
  plans: [
    { id: 'care', name: 'Website Care', price: 97, desc: 'Updates, security monitoring, backups and support.' },
    { id: 'seo', name: 'SEO and Content Growth', price: 497, desc: 'Local SEO, content, keyword tracking and Google Business Profile.' },
    { id: 'ads', name: 'Ads Growth Plan', price: 997, desc: 'Google Ads management, landing pages, tracking and monthly strategy calls.' },
  ],
};

export const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
