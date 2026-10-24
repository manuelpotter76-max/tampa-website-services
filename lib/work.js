export const QUOTES = {
  pims: { text: 'Not only did they meet our needs, they anticipated them, provided ideas and executed. Even with the changes and updates, it was on-time. We were blown away.', by: 'Suzanne Pyzik, CPA, CEO, PIMS Inc.' },
  pimsShort: { text: 'Not only did they meet our needs, they anticipated them, provided ideas and executed.', by: 'Suzanne Pyzik, CPA, CEO' },
  ysf: { text: "Development went very smooth too. We didn't have to babysit them or spoon feed them. They even managed to squeeze in some features that were scheduled for a future phase and that was a nice bonus!", by: 'Tess Gallette, Founder and CEO, Your Sales Floor' },
  ysfShort: { text: 'They even managed to squeeze in some features that were scheduled for a future phase and that was a nice bonus!', by: 'Tess Gallette, Founder and CEO' },
};

export const WORK = [
  {
    id: 'pims', name: 'PIMS Inc.', facts: 'Medical billing · Tampa · Client · 2018', short: 'Medical billing · Client · 2018',
    img: '/images/pims-after.jpg', alt: 'PIMS Inc. homepage after the redesign',
    story: 'A Tampa billing company serving eight medical specialties had outgrown its 2016 desktop-only site. We rebuilt it with a page for every specialty and one login menu for patients, clients and staff.',
    quote: QUOTES.pims, quoteShort: QUOTES.pimsShort, tags: ['Design', 'Copywriting', 'On-site SEO'], href: '/work/pims-inc',
  },
  {
    id: 'ysf', name: 'Your Sales Floor', facts: 'Outsourced sales · Port Richey · Client · 2025', short: 'Outsourced sales · Client · 2025',
    img: '/images/your-sales-floor.jpg', alt: 'Your Sales Floor homepage',
    story: 'Your Sales Floor runs done-for-you sales teams for high-ticket brands. We built its first website from scratch: deep navy, live-data texture, and two clear paths, Apply Now or Book an Appointment.',
    quote: QUOTES.ysf, quoteShort: QUOTES.ysfShort, tags: ['Design', 'Copywriting', 'Conversion CTAs'], href: null,
  },
  {
    id: 'bot', name: 'Blogs on Tap', facts: 'Content subscription · Tampa · Our own brand · 2026', short: 'Content subscription · Our own brand · 2026',
    img: '/images/blogs-on-tap.jpg', alt: 'Blogs on Tap homepage',
    story: 'Our own content membership: five blog posts a month for $50. We built its first site with one job, make a subscription feel as simple as the name. One headline, one price, one button.',
    quote: null, tags: ['Design', 'Copywriting', 'Conversion CTA'], href: null,
  },
];
