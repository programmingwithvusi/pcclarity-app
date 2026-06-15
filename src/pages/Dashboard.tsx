import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useScan } from '../hooks/useScan';
import { useSubscription } from '../hooks/useSubscription';
import { useUser } from '../hooks/useUser';
import { formatBytes } from '../api/client';
import { HealthRing } from '../components/HealthRing';
import { MetricCard } from '../components/MetricCard';
import { IssueRow } from '../components/IssueRow';
import { AiAssistant } from '../components/AiAssistant';

export function Dashboard() {
  const { userId } = useUser();
  const { data: report, isFetching, runScan, rateLimitInfo } = useScan(userId);
  const { isPro, upgrade, data: sub } = useSubscription(userId);
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Refetch subscription if returning from Stripe checkout
  useEffect(() => {
    if (searchParams.get('upgraded') === 'true') {
      queryClient.invalidateQueries({ queryKey: ['subscription', userId] });
    }
  }, [searchParams, userId, queryClient]);

  // Auto-run scan on first load
  useEffect(() => {
    runScan();
  }, []); // eslint-disable-line

  return (
    <div
      style={{ minHeight: '100vh', background: '#f9fafb', padding: '1.5rem' }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: '#111' }}>
            PC<span style={{ color: '#3b82f6' }}>Clarity</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontSize: 11,
                padding: '3px 10px',
                borderRadius: 99,
                background: isPro ? '#dcfce7' : '#f3f4f6',
                color: isPro ? '#166534' : '#6b7280',
                fontWeight: 500,
              }}
            >
              {isPro ? 'Pro' : 'Free plan'}
            </span>
            {!isPro && (
              <button
                onClick={upgrade}
                style={{
                  fontSize: 12,
                  padding: '5px 14px',
                  borderRadius: 99,
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>

        {/* Rate limit banner */}
        {rateLimitInfo && (
          <div
            style={{
              background: '#fef3c7',
              border: '1px solid #fcd34d',
              borderRadius: 10,
              padding: '10px 16px',
              marginBottom: 16,
              fontSize: 13,
              color: '#92400e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>
              Free plan: 1 scan per 24 hours. Next scan in{' '}
              {rateLimitInfo.retryAfterMinutes} min.
            </span>
            <button
              onClick={upgrade}
              style={{
                fontSize: 12,
                padding: '4px 12px',
                borderRadius: 6,
                background: '#f59e0b',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Upgrade for unlimited scans
            </button>
          </div>
        )}

        {/* Health score */}
        {report && (
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: '1.5rem',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <HealthRing score={report.healthScore} />
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#111',
                  marginBottom: 4,
                }}
              >
                Your PC health score —{' '}
                <span
                  style={{
                    color:
                      report.healthScore >= 80
                        ? '#22c55e'
                        : report.healthScore >= 55
                          ? '#f59e0b'
                          : '#ef4444',
                  }}
                >
                  {report.scoreLabel}
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                {report.issues.filter((i) => i.severity !== 'info').length}{' '}
                issue
                {report.issues.filter((i) => i.severity !== 'info').length !== 1
                  ? 's'
                  : ''}{' '}
                found. Last scanned{' '}
                {new Date(report.scannedAt).toLocaleTimeString()}.
              </div>
            </div>
          </div>
        )}

        {/* Metrics grid */}
        {report && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 10,
              marginBottom: 12,
            }}
          >
            <MetricCard
              label="Junk files"
              value={formatBytes(report.disk.junkBytes)}
              sub="Taking up space"
            />
            <MetricCard
              label="Startup programs"
              value={String(report.startup.count)}
              sub="Slowing boot time"
            />
            <MetricCard
              label="RAM usage"
              value={`${report.ram.usedPercent}%`}
              sub={
                report.ram.usedPercent > 75
                  ? 'Higher than ideal'
                  : 'Looking good'
              }
            />
            <MetricCard
              label="Disk usage"
              value={`${report.disk.usedPercent}%`}
              sub={formatBytes(report.disk.freeBytes) + ' free'}
            />
          </div>
        )}

        {/* Issues */}
        {report && (
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: '1.25rem',
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#111',
                marginBottom: 12,
              }}
            >
              Issues found
            </div>
            {report.issues.map((issue) => (
              <IssueRow key={issue.id} issue={issue} onAsk={() => {}} />
            ))}
          </div>
        )}

        {/* Empty / loading state */}
        {!report && !isFetching && (
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: '3rem',
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 15, color: '#6b7280' }}>
              Run a scan to see your PC health report.
            </div>
          </div>
        )}

        {/* AI Assistant */}
        <div style={{ marginBottom: 12 }}>
          <AiAssistant isPro={isPro} onUpgrade={upgrade} />
        </div>

        {/* Scan button */}
        <button
          onClick={runScan}
          disabled={isFetching}
          style={{
            width: '100%',
            padding: 13,
            borderRadius: 10,
            border: '1px solid #e5e7eb',
            background: '#fff',
            fontSize: 14,
            fontWeight: 500,
            color: '#111',
            cursor: isFetching ? 'not-allowed' : 'pointer',
            opacity: isFetching ? 0.6 : 1,
          }}
        >
          {isFetching ? 'Scanning...' : 'Run new scan'}
        </button>

        <div
          style={{
            textAlign: 'center',
            marginTop: 16,
            fontSize: 11,
            color: '#d1d5db',
          }}
        >
          User ID: {userId.slice(0, 12)}...
          {sub && <span> · Plan: {sub.plan}</span>}
        </div>
      </div>
    </div>
  );
}
