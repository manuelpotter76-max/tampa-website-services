// One place for business details. Fill the nulls before launch.
export const SITE = {
  name: 'Tampa Website Services',
  tagline: 'Websites + AI systems, built in Ybor City.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tampawebsiteservices.com',
  phone: '813-816-2669',
  phoneHref: 'tel:+18138162669',
  // The demo line for "call and hang up". Leave empty until the text-back number is live.
  demoPhone: process.env.NEXT_PUBLIC_DEMO_PHONE || '',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  bookingUrl: 'https://tampawebsiteservices.zohobookings.com/#/4940624000000036032',
  linkedin: 'https://www.linkedin.com/in/manuelpotter',
  street: '', // e.g. '1600 E 7th Ave'
  city: 'Tampa',
  region: 'FL',
  neighborhood: 'Ybor City',
  hours: '', // e.g. 'Mon to Fri, 9 AM to 5 PM'
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
