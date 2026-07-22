'use client';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/app-context';
import { DEMO_AI_SUGGESTIONS } from '@/lib/demo-data';

const AI_RESPONSES = {
  'how much have i contributed this year': 'Based on your records, you have contributed a total of **8,000 RWF** this year across 2 approved transactions. Your most recent contribution was 5,000 RWF for Monthly Contribution on July 15th. You\'re making great progress! 🙏',
  'what contributions are due this month': 'For this month, you have the following contributions due:\n\n• **Monthly Contribution**: 5,000 RWF (employed, local)\n• **Building Fund**: 3,000 RWF (optional but encouraged)\n\nWould you like me to take you to the contribution page?',
  'show my recent receipts': 'Here are your recent receipts:\n\n✅ **July 15, 2026** — Monthly Contribution: 5,000 RWF (Ref: MTN-2026071501)\n✅ **June 25, 2026** — Building Fund: 3,000 RWF (Ref: MTN-2026071513)\n\nAll receipts have also been sent to your email.',
  'what events are coming up': 'Upcoming events at Shining Ministries:\n\n📅 **July 20** — Sunday Worship Service (9:00 AM)\n📅 **July 21** — Choir Practice (4:00 PM)\n📅 **July 22** — Youth Fellowship (5:00 PM)\n📅 **July 24** — Prayer Night (7:00 PM)\n📅 **Aug 2** — Leadership Summit (10:00 AM)',
  'which campaigns are active': 'There are currently **3 active campaigns**:\n\n🏛️ **New Church Building** — 65% funded (32.4M / 50M RWF)\n🌍 **Youth Mission Trip** — 64% funded (3.2M / 5M RWF)\n🤝 **Community Outreach** — 62% funded (1.85M / 3M RWF)\n\nWould you like to contribute to any of these?',
  'default': 'Thank you for your question! As the SM Connect AI Assistant, I can help you with:\n\n• Contribution history and dues\n• Event schedules\n• Campaign information\n• Attendance records\n• Ministry announcements\n\nHow can I assist you today? 🌟',
};

export default function AIPage() {
  const { user } = useApp();
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hello ${user?.name?.split(' ')[0] || 'there'}! 👋\n\nI\'m your SM Connect AI Assistant. I can help you with contributions, events, campaigns, and more.\n\nHow can I serve you today?` },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const sendMessage = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setTyping(true);

    const key = msg.toLowerCase().trim().replace(/[?!.]/g, '');
    const response = Object.entries(AI_RESPONSES).find(([k]) => key.includes(k));

    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: response ? response[1] : AI_RESPONSES.default,
      }]);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="page-member-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 170px)' }}>
      <div className="page-header" style={{ flexShrink: 0, marginBottom: 'var(--space-md)' }}>
        <h1>✨ AI Assistant</h1>
        <p>Your personal ministry companion</p>
      </div>

      {/* Chat Area */}
      <div ref={chatRef} style={{
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
        gap: 'var(--space-md)', paddingBottom: 'var(--space-md)',
      }}>
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
            {msg.content.split('\n').map((line, j) => (
              <span key={j}>
                {line.replace(/\*\*(.*?)\*\*/g, '«$1»').split('«').map((part, k) => {
                  if (part.includes('»')) {
                    const [bold, rest] = part.split('»');
                    return <span key={k}><strong>{bold}</strong>{rest}</span>;
                  }
                  return part;
                })}
                {j < msg.content.split('\n').length - 1 && <br />}
              </span>
            ))}
          </div>
        ))}
        {typing && (
          <div className="chat-bubble chat-bubble-ai chat-typing">
            <span /><span /><span />
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)',
          marginBottom: 'var(--space-md)', flexShrink: 0,
        }}>
          {DEMO_AI_SUGGESTIONS.map(s => (
            <button key={s} className="btn btn-secondary btn-sm" onClick={() => sendMessage(s)}
              style={{ fontSize: 'var(--text-xs)' }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        display: 'flex', gap: 'var(--space-sm)', flexShrink: 0,
        background: 'var(--glass-bg)', borderRadius: 'var(--radius-full)',
        padding: 6, border: '1px solid var(--border-light)',
      }}>
        <input
          className="input"
          style={{ border: 'none', background: 'none', borderRadius: 'var(--radius-full)' }}
          placeholder="Ask me anything..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button className="btn btn-gold" style={{ borderRadius: 'var(--radius-full)', padding: '10px 20px' }}
          onClick={() => sendMessage()}>
          Send
        </button>
      </div>
    </div>
  );
}
