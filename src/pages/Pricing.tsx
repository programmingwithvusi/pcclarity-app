import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';
import { useUser } from '../hooks/useUser';

const FREE_FEATURES = [
  { on: true, text: '1 PC scan per day' },
  { on: true, text: 'Basic AI assistant (5 questions/day)' },
  { on: true, text: 'Health score + issue list' },
  { on: false, text: 'Step-by-step fix guides' },
  { on: false, text: 'Unlimited scans' },
  { on: false, text: 'Scheduled auto-scans' },
  { on: false, text: 'PDF health report' },
];

const PRO_FEATURES = [
  { on: true, text: 'Unlimited PC scans' },
  { on: true, text: 'Full AI assistant — unlimited questions' },
  { on: true, text: 'Health score + detailed breakdown' },
  { on: true, text: 'Step-by-step fix guides' },
  { on: true, text: 'Scheduled auto-scans (daily/weekly)' },
  { on: true, text: 'PDF health report' },
  { on: true, text: 'Priority email support' },
];

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const { userId } = useUser();
  const { upgrade, isPro } = useSubscription(userId);
  const navigate = useNavigate();

  const monthlyPrice = 149;
  const annualMonthly = Math.round(monthlyPrice * 0.7);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f9fafb',
        padding: '3rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            fontSize: 13,
            color: '#6b7280',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginBottom: 24,
            padding: 0,
          }}
        >
          ← Back to dashboard
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div
            style={{
              fontSize: 13,
              color: '#3b82f6',
              fontWeight: 500,
              marginBottom: 8,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Simple pricing
          </div>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: '#111',
              marginBottom: 12,
              lineHeight: 1.2,
            }}
          >
            Your PC deserves to run like new
          </h1>
          <p
            style={{
              fontSize: 15,
              color: '#6b7280',
              maxWidth: 440,
              margin: '0 auto',
            }}
          >
            Start free. Upgrade when you're ready. No hidden fees, cancel
            anytime.
          </p>
        </div>

        {/* Billing toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 13, color: annual ? '#9ca3af' : '#111' }}>
            Monthly
          </span>
          <div
            onClick={() => setAnnual((a) => !a)}
            style={{
              width: 44,
              height: 24,
              borderRadius: 99,
              cursor: 'pointer',
              background: annual ? '#3b82f6' : '#e5e7eb',
              position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: 3,
                left: annual ? 23 : 3,
                transition: 'left 0.2s',
              }}
            />
          </div>
          <span style={{ fontSize: 13, color: annual ? '#111' : '#9ca3af' }}>
            Annual
          </span>
          <span
            style={{
              fontSize: 11,
              padding: '3px 10px',
              borderRadius: 99,
              background: '#dcfce7',
              color: '#166534',
              fontWeight: 500,
            }}
          >
            Save 30%
          </span>
        </div>

        {/* Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
            marginBottom: 32,
          }}
        >
          {/* Free */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 16,
              padding: '1.75rem',
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 12,
              }}
            >
              Free
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 4,
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 14, color: '#6b7280' }}>R</span>
              <span
                style={{
                  fontSize: 44,
                  fontWeight: 700,
                  color: '#111',
                  lineHeight: 1,
                }}
              >
                0
              </span>
              <span style={{ fontSize: 13, color: '#9ca3af' }}>/mo</span>
            </div>
            <div style={{ height: 18, marginBottom: 20 }} />
            <div
              style={{ height: 1, background: '#f3f4f6', marginBottom: 20 }}
            />
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                marginBottom: 24,
              }}
            >
              {FREE_FEATURES.map((f, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    fontSize: 13,
                    color: f.on ? '#111' : '#9ca3af',
                  }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      flexShrink: 0,
                      marginTop: 1,
                      background: f.on ? '#dbeafe' : '#f3f4f6',
                      color: f.on ? '#3b82f6' : '#d1d5db',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                    }}
                  >
                    {f.on ? '✓' : '–'}
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 10,
                border: '1px solid #e5e7eb',
                background: 'transparent',
                fontSize: 14,
                fontWeight: 500,
                color: '#111',
                cursor: 'pointer',
              }}
            >
              Get started free
            </button>
          </div>

          {/* Pro */}
          <div
            style={{
              background: '#fff',
              border: '2px solid #3b82f6',
              borderRadius: 16,
              padding: '1.75rem',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#3b82f6',
                color: '#fff',
                fontSize: 11,
                fontWeight: 500,
                padding: '4px 14px',
                borderRadius: 99,
                whiteSpace: 'nowrap',
              }}
            >
              Most popular
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 12,
              }}
            >
              Pro
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 4,
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 14, color: '#6b7280' }}>R</span>
              <span
                style={{
                  fontSize: 44,
                  fontWeight: 700,
                  color: '#111',
                  lineHeight: 1,
                }}
              >
                {annual ? annualMonthly : monthlyPrice}
              </span>
              <span style={{ fontSize: 13, color: '#9ca3af' }}>/mo</span>
            </div>
            <div
              style={{
                height: 18,
                marginBottom: 20,
                fontSize: 12,
                color: annual ? '#22c55e' : 'transparent',
              }}
            >
              {annual
                ? `Billed R${annualMonthly * 12}/year — save R${(monthlyPrice - annualMonthly) * 12}`
                : '.'}
            </div>
            <div
              style={{ height: 1, background: '#f3f4f6', marginBottom: 20 }}
            />
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                marginBottom: 24,
              }}
            >
              {PRO_FEATURES.map((f, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    fontSize: 13,
                    color: '#111',
                  }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      flexShrink: 0,
                      marginTop: 1,
                      background: '#dbeafe',
                      color: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                    }}
                  >
                    ✓
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>
            <button
              onClick={isPro ? () => navigate('/dashboard') : upgrade}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 10,
                border: 'none',
                background: '#3b82f6',
                fontSize: 14,
                fontWeight: 500,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              {isPro ? "You're on Pro" : 'Upgrade to Pro'}
            </button>
          </div>
        </div>

        {/* Trust signals */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 24,
            fontSize: 12,
            color: '#9ca3af',
          }}
        >
          {[
            'Cancel anytime',
            'No credit card for free plan',
            'Works on Windows 10 & 11',
            'Secure payments via Stripe',
          ].map((t) => (
            <span
              key={t}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#22c55e',
                  display: 'inline-block',
                }}
              />
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
