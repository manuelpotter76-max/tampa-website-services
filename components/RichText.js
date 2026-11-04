import Link from 'next/link';

// Renders **bold**, *italic* and [links](/path) inside a line of post text.
const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;

export function Rich({ text }) {
  return String(text).split(TOKEN).filter(Boolean).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
    const m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (m) {
      const [, label, href] = m;
      return href.startsWith('/')
        ? <Link key={i} href={href} className="textlink">{label}</Link>
        : <a key={i} href={href} className="textlink" rel="noopener noreferrer" target="_blank">{label}</a>;
    }
    return part;
  });
}

// Plain-text version for meta tags and structured data.
export const plain = (text) => String(text).replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
