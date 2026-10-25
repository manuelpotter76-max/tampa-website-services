import Legal from '@/components/Legal';
import { SITE } from '@/lib/site';

export const metadata = { title: 'Terms of Use', description: 'Terms for using the Tampa Website Services website, audit and AI concierge.', alternates: { canonical: '/terms' } };

export default function Terms() {
  return (
    <Legal title="Terms of use" updated="October 25, 2026">
      <p>This website is run by {SITE.legalName}, doing business as Tampa Website Services. By using it you agree to these terms. If you do not agree, please do not use the site.</p>
      <h2>Prices and quotes</h2>
      <p>Prices on this site, including those shared by our AI concierge, are starting points and not offers. Your project price is set in a written quote.</p>
      <h2>Free audit</h2>
      <p>The audit is an automated estimate based on public information and Google PageSpeed. It is provided as-is for general guidance and is not a guarantee of results or of legal compliance, including accessibility compliance.</p>
      <h2>AI concierge</h2>
      <p>Our chat is run by AI. It can make mistakes. Do not rely on it for legal, medical, financial or safety advice. In an emergency, call 911.</p>
      <h2>Your content</h2>
      <p>Do not submit anything unlawful or anyone else&apos;s private information. Do not try to misuse the audit or chat tools.</p>
      <h2>Liability</h2>
      <p>To the extent the law allows, {SITE.legalName} is not liable for indirect or consequential losses from using this site. [Lawyer to review.]</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the State of Florida.</p>
      <h2>Contact</h2>
      <p>Questions? Call {SITE.phone}{SITE.email ? ' or email ' + SITE.email : ''}.</p>
    </Legal>
  );
}
