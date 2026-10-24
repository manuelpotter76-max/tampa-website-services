'use client';
import Link from 'next/link';
import { Icon } from './Logo';
import { SITE } from '@/lib/site';

export default function PinnedBar() {
  return (
    <div className="pinned" role="region" aria-label="Quick actions">
      <Link href="/website-audit-review-request" className="btn btn-primary">Get your AI audit</Link>
      <button type="button" className="btn btn-secondary icon-btn" aria-label="Chat with our AI assistant" onClick={() => window.dispatchEvent(new Event('tws:open-chat'))}>
        <Icon name="chat" />
      </button>
      <a href={SITE.phoneHref} className="btn btn-secondary icon-btn" aria-label={'Call ' + SITE.phone}>
        <Icon name="phone" />
      </a>
    </div>
  );
}
