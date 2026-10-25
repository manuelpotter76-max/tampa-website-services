import Legal from '@/components/Legal';
import { SITE } from '@/lib/site';

export const metadata = { title: 'How We Handle Your Data with AI', description: 'Plain-English explanation of how Tampa Website Services uses AI and what happens to your data.', alternates: { canonical: '/ai-data-policy' } };

export default function AiPolicy() {
  return (
    <Legal title="How we handle your data with AI" updated="October 25, 2026">
      <p>We use AI on this site and in the systems we build for clients. Here is how it works, in plain English.</p>
      <h2>Where we use AI</h2>
      <ul>
        <li><strong>AI concierge:</strong> answers questions and helps you book a call. It always tells you it is an AI.</li>
        <li><strong>Website audit:</strong> scores your site using Google PageSpeed and an automated check of the public page.</li>
      </ul>
      <h2>What the AI sees</h2>
      <p>Only what you type into the chat, plus the page you are on. Please do not share passwords, card numbers or health details in the chat.</p>
      <h2>Who runs the AI</h2>
      <p>The concierge uses Anthropic&apos;s Claude through their business API. [Confirm provider data terms, for example that API data is not used to train models.]</p>
      <h2>What we keep</h2>
      <p>We save chat transcripts and audit results so we can follow up and improve our answers. We keep them for 2 years after your last interaction with us, then delete them automatically. Ask us to delete yours anytime at {SITE.email} or {SITE.phone}.</p>
      <h2>People stay in charge</h2>
      <p>AI never signs contracts, sets final prices or makes decisions about you. A person reviews every project quote.</p>
    </Legal>
  );
}
