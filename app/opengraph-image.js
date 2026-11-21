import { ogCard, OG_SIZE } from '@/lib/og';

export const alt = 'Tampa Website Services: websites that answer, follow up and book the job.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogCard({ eyebrow: 'Websites + AI systems', title: 'Websites that answer, follow up and book the job.', sub: 'Custom websites with AI chat, instant follow-up and booking built in.' });
}
