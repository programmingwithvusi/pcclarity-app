interface Props {
  score: number;
  size?: number;
}

const colorFor = (score: number) =>
  score >= 80 ? '#3ecf8e' : score >= 55 ? '#f59e0b' : '#ef4444';

export function HealthRing({ score, size = 96 }: Props) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = colorFor(score);

  return (
    <div
      style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
    >
      <svg width={size} height={size} viewBox="0 0 88 88">
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 44 44)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: '#111',
            lineHeight: 1,
          }}
        >
          {score}
        </div>
        <div style={{ fontSize: 10, color: '#9ca3af' }}>/ 100</div>
      </div>
    </div>
  );
}
