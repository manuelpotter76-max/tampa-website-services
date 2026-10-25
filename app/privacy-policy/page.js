import Legal from '@/components/Legal';
import { SITE } from '@/lib/site';

export const metadata = { title: 'Privacy Policy', description: 'How Tampa Website Services collects, uses and protects your information.', alternates: { canonical: '/privacy-policy' } };

export default function Privacy() {
  const email = SITE.email;
  return (
    <Legal title="Privacy policy" updated="October 25, 2026">
      <p>This policy explains what {SITE.legalName}, doing business as Tampa Website Services (&quot;we&quot;) collects when you use {SITE.url.replace('https://', '')}, and what we do with it.</p>
      <h2>What we collect</h2>
      <ul>
        <li><strong>Things you give us:</strong> your name, email, phone, website address and message when you use our contact form, audit or chat.</li>
        <li><strong>Audit data:</strong> the website address you enter and the results of the scan.</li>
        <li><strong>Chat conversations:</strong> messages you send to our AI concierge.</li>
        <li><strong>Basic usage data:</strong> pages visited and device type, through our hosting provider.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To answer your questions, send your audit report and follow up about your project.</li>
        <li>To improve our site and our AI concierge.</li>
        <li>We do not sell your personal information.</li>
      </ul>
      <h2>Text messages</h2>
      <p>If you check the SMS consent box, we may text you about your inquiry. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. We do not share your mobile number or SMS consent with third parties for their marketing.</p>
      <h2>Who helps us run the site</h2>
      <p>We use service providers to host the site, store form submissions, run the AI concierge, scan websites and send email. They only use your data to provide those services to us. They are Vercel (hosting), Supabase (database), Anthropic (AI assistant), Google PageSpeed Insights (website audits), Resend (email) and Zoho Bookings (scheduling).</p>
      <h2>How long we keep it</h2>
      <p>[Retention period, for example: we keep inquiries and chat logs for up to 24 months, then delete them.]</p>
      <h2>Your choices</h2>
      <p>You can ask us to see, correct or delete your information by emailing {email} or calling {SITE.phone}.</p>
      <h2>Contact</h2>
      <p>{SITE.legalName}, {SITE.location}. {email} · {SITE.phone}.</p>
    </Legal>
  );
}
