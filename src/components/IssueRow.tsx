import type { HealthIssue } from '../types';

const dotColor: Record<string, string> = {
  critical: '#ef4444',
  warning: '#f59e0b',
  info: '#22c55e',
};

interface Props {
  issue: HealthIssue;
  onAsk: (q: string) => void;
}

export function IssueRow({ issue, onAsk }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 0',
        borderBottom: '1px solid #f3f4f6',
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          flexShrink: 0,
          marginTop: 5,
          background: dotColor[issue.severity] ?? '#9ca3af',
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, color: '#111', fontWeight: 500 }}>
          {issue.title}
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
          {issue.detail}
        </div>
      </div>
      {issue.severity !== 'info' && (
        <button
          onClick={() => onAsk(`How do I fix: ${issue.title}?`)}
          style={{
            fontSize: 12,
            padding: '4px 12px',
            borderRadius: 6,
            border: '1px solid #e5e7eb',
            background: 'transparent',
            color: '#374151',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          How to fix
        </button>
      )}
    </div>
  );
}
