export function Mark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <polyline points="20,14 6,32 20,50" fill="none" stroke="#E6EAF2" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="44,14 58,32 44,50" fill="none" stroke="#E6EAF2" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="11" fill="none" stroke="#A78BFA" strokeWidth="2" opacity="0.45" />
      <circle cx="32" cy="32" r="6" fill="#A78BFA" />
    </svg>
  );
}

export function Icon({ name, size = 20, color = 'currentColor' }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  switch (name) {
    case 'phone':
      return <svg {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>;
    case 'mail':
      return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
    case 'calendar':
      return <svg {...p}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
    case 'pin':
      return <svg {...p}><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>;
    case 'arrow':
      return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case 'menu':
      return <svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case 'close':
      return <svg {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>;
    case 'chat':
      return <svg {...p}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z" /></svg>;
    case 'check':
      return <svg {...p} stroke="#34D399" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>;
    case 'play':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>;
    default:
      return null;
  }
}
