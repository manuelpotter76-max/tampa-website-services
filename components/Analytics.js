'use client';
import Script from 'next/script';
import { useEffect } from 'react';
import { SITE } from '@/lib/site';
import { track } from '@/lib/track';

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-HR7QQNF20E';

// Google Analytics 4. Only reports on the real domain, so preview links and testing don't skew the numbers.
export default function Analytics() {
  useEffect(() => {
    // Track "Book a call" and phone taps anywhere on the site with one listener.
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      const where = window.location.pathname;
      if (href.startsWith(SITE.bookingUrl.split('#')[0])) track('book_call_click', { link_text: a.textContent.trim().slice(0, 60), page_path: where });
      else if (href.startsWith('tel:')) track('phone_click', { page_path: where });
      else if (href.startsWith('mailto:')) track('email_click', { page_path: where });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        if (/(^|\\.)tampawebsiteservices\\.com$/.test(location.hostname)) {
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        }
      `}</Script>
    </>
  );
}
