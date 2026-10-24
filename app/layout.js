import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PinnedBar from '@/components/PinnedBar';
import ConciergeLauncher from '@/components/Concierge';
import { SITE } from '@/lib/site';

const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: 'Tampa Website Services | Websites + AI Systems in Tampa Bay', template: '%s | Tampa Website Services' },
  description: 'Tampa web design with AI built in. Websites that answer, follow up and book the job for HVAC, plumbing, roofing, med spas, local businesses and Florida government.',
  openGraph: { siteName: SITE.name, type: 'website', locale: 'en_US', images: ['/images/manny-potter.jpg'] },
  twitter: { card: 'summary_large_image' },
};

export const viewport = { themeColor: '#0B1020', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <PinnedBar />
        <ConciergeLauncher />
      </body>
    </html>
  );
}
