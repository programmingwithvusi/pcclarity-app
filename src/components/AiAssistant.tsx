import { useState, useRef, useEffect } from 'react';

interface Props {
  isPro: boolean;
  onUpgrade: () => void;
}

const CHIPS = [
  'Why is my PC slow?',
  'Is my PC safe?',
  'How do I free up disk space?',
  'What is a startup program?',
];

export function AiAssistant({ isPro, onUpgrade }: Props) {
  const [messages, setMessages] = useState<
    { role: 'user' | 'ai'; text: string }[]
  >([
    {
      role: 'ai',
      text: "Hi! I'm your PC assistant. Ask me anything about your computer — I'll explain it in plain English.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const FREE_LIMIT = 5;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function ask(q: string) {
    if (!q.trim()) return;

    const limitHit = !isPro && questionCount >= FREE_LIMIT;
    if (limitHit) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: q },
        {
          role: 'ai',
          text: "You've reached the free plan limit of 5 questions. Upgrade to Pro for unlimited AI assistance!",
        },
      ]);
      return;
    }

    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);
    setQuestionCount((c) => c + 1);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system:
            'You are a friendly PC health assistant inside a Windows app called PCClarity. Users have little or no tech knowledge. Answer in plain, warm English — 2 to 4 sentences max. No bullet points. If you use a tech term, explain it simply in brackets.',
          messages: [{ role: 'user', content: q }],
        }),
      });
      const data = await res.json();
      console.log('AI response:', data);
      const text =
        data.content?.find((b: { type: string }) => b.type === 'text')?.text ??
        'Sorry, I had trouble with that. Please try again.';
      setMessages((prev) => [...prev, { role: 'ai', text }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '1.25rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#3b82f6',
          }}
        />
        <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>
          AI PC assistant
        </span>
        {!isPro && (
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 11,
              color: '#6b7280',
            }}
          >
            {FREE_LIMIT - questionCount} questions left
          </span>
        )}
      </div>

      {/* Chat messages */}
      <div
        style={{
          maxHeight: 280,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          marginBottom: 12,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              background: m.role === 'user' ? '#3b82f6' : '#f3f4f6',
              color: m.role === 'user' ? '#fff' : '#111',
              borderRadius:
                m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              padding: '8px 12px',
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div
            style={{
              alignSelf: 'flex-start',
              background: '#f3f4f6',
              borderRadius: '12px 12px 12px 2px',
              padding: '8px 12px',
              fontSize: 13,
              color: '#9ca3af',
            }}
          >
            Thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick chips */}
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}
      >
        {CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => ask(chip)}
            style={{
              fontSize: 11,
              padding: '4px 10px',
              borderRadius: 99,
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#6b7280',
              cursor: 'pointer',
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask(input)}
          placeholder="Ask anything about your PC..."
          style={{
            flex: 1,
            fontSize: 13,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            outline: 'none',
            color: '#111',
          }}
        />
        <button
          onClick={() => ask(input)}
          disabled={loading}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            background: '#3b82f6',
            color: '#fff',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Ask
        </button>
      </div>

      {/* Upgrade nudge for free users near limit */}
      {!isPro && questionCount >= FREE_LIMIT - 1 && (
        <div
          style={{
            marginTop: 10,
            background: '#eff6ff',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 12,
            color: '#1d4ed8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>Upgrade for unlimited AI answers</span>
          <button
            onClick={onUpgrade}
            style={{
              fontSize: 12,
              padding: '3px 10px',
              borderRadius: 6,
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Upgrade
          </button>
        </div>
      )}
    </div>
  );
}
