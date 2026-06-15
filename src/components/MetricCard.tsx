interface Props {
  label: string;
  value: string;
  sub: string;
}

export function MetricCard({ label, value, sub }: Props) {
  return (
    <div
      style={{
        background: '#f9fafb',
        borderRadius: 10,
        padding: '14px 16px',
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
        {label}
      </div>
      <div
        style={{ fontSize: 20, fontWeight: 600, color: '#111', lineHeight: 1 }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>{sub}</div>
    </div>
  );
}
