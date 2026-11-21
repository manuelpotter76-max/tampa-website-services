import { ImageResponse } from 'next/og';

// Branded 1200x630 share card used for link previews (Facebook, LinkedIn, iMessage, Slack).
export const OG_SIZE = { width: 1200, height: 630 };

const NAVY = '#0B1020';
const INK = '#E6EAF2';
const MUTED = '#9AA3B8';
const VIOLET = '#A78BFA';

const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><polyline points="20,14 6,32 20,50" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="44,14 58,32 44,50" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="32" r="11" fill="none" stroke="${VIOLET}" stroke-width="2" opacity="0.45"/><circle cx="32" cy="32" r="6" fill="${VIOLET}"/></svg>`;
const MARK_SRC = 'data:image/svg+xml;base64,' + Buffer.from(MARK).toString('base64');

export function ogCard({ eyebrow, title, sub }) {
  const t = String(title || '');
  const size = t.length > 70 ? 54 : t.length > 45 ? 64 : 76;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '64px 72px', background: NAVY, color: INK,
          backgroundImage: 'linear-gradient(rgba(167,139,250,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.07) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <img src={MARK_SRC} width={64} height={64} alt="" />
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>Tampa Website Services</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {eyebrow ? <div style={{ display: 'flex', fontSize: 26, color: VIOLET, letterSpacing: 3, textTransform: 'uppercase' }}>{eyebrow}</div> : null}
          <div style={{ display: 'flex', fontSize: size, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 1040 }}>{t}</div>
          {sub ? <div style={{ display: 'flex', fontSize: 30, color: MUTED, lineHeight: 1.35, maxWidth: 980 }}>{sub}</div> : null}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: MUTED }}>
          <div style={{ display: 'flex' }}>Websites + AI systems · Tampa, Florida</div>
          <div style={{ display: 'flex', color: INK }}>tampawebsiteservices.com</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
