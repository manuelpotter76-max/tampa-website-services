// Tampa skyline line art that resolves into a network. Nodes light up in sequence (CSS, respects reduced motion).
const NODES = [[45, 250, 4], [105, 180, 4], [165, 96, 5], [225, 150, 4], [280, 70, 6], [335, 200, 4], [395, 140, 4], [450, 230, 4]];
const BLDG = ['M20 340 V250 H70 V340', 'M80 340 V180 H130 V340', 'M140 340 V120 L165 96 L190 120 V340', 'M200 340 V150 H250 V340', 'M260 340 V70 H300 V340', 'M310 340 V200 H360 V340', 'M370 340 V140 H420 V340', 'M430 340 V230 H470 V340', 'M10 340 H470'];

export default function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 480 360" style={{ width: '100%', maxWidth: 480, height: 'auto' }} role="img" aria-label="Tampa skyline line art turning into a network of connected points">
      <defs>
        <filter id="tws-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <g fill="none" stroke="#6B7799" strokeWidth="1.5">{BLDG.map((d) => <path key={d} d={d} />)}</g>
      <g fill="none" stroke="#A78BFA" strokeWidth="1.5" opacity="0.25">
        <line x1="165" y1="96" x2="280" y2="70" /><line x1="105" y1="180" x2="225" y2="150" /><line x1="280" y1="70" x2="395" y2="140" /><line x1="225" y1="150" x2="335" y2="200" />
      </g>
      <g>
        {NODES.slice(0, -1).map((n, i) => (
          <line key={'s' + i} className="seg" style={{ '--i': i }} x1={n[0]} y1={n[1]} x2={NODES[i + 1][0]} y2={NODES[i + 1][1]} stroke="#C4B5FD" strokeWidth="2.5" strokeLinecap="round" />
        ))}
      </g>
      <g>{NODES.map((n, i) => <circle key={'h' + i} className="halo" style={{ '--i': i }} cx={n[0]} cy={n[1]} r={n[2] * 4} fill="#A78BFA" filter="url(#tws-glow)" />)}</g>
      <g>{NODES.map((n, i) => <circle key={'n' + i} className="node" style={{ '--i': i }} cx={n[0]} cy={n[1]} r={n[2]} fill="#A78BFA" />)}</g>
    </svg>
  );
}
