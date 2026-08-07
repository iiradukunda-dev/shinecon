'use client';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/app-context';
import { AI_SUGGESTIONS } from '@/lib/utils';
import { OnlineLogoIcon } from '@/components/icons';

export default function AIPage() {
  const { user, campaigns, events, contributions } = useApp();
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: `Hello ${user?.name?.split(' ')[0] || 'there'}!\n\nI\'m your SM Connect AI Assistant. I can help you with contributions, events, campaigns, and more.\n\nHow can I serve you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setInput('');
    setTyping(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context: { user, campaigns, events, contributions },
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: data.content || data.error || 'Sorry, I encountered an error.',
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: 'Failed to connect to the AI service.',
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div
      className="page-member-content"
      style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 170px)' }}
    >
      <div className="page-header" style={{ flexShrink: 0, marginBottom: 'var(--space-md)' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <OnlineLogoIcon name="sparkles" size={28} /> AI Assistant
        </h1>
        <p>Your personal ministry companion</p>
      </div>

      {/* Chat Area */}
      <div
        ref={chatRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
          paddingBottom: 'var(--space-md)',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
          >
            {msg.content.split('\n').map((line, j) => (
              <span key={j}>
                {line
                  .replace(/\*\*(.*?)\*\*/g, '«$1»')
                  .split('«')
                  .map((part, k) => {
                    if (part.includes('»')) {
                      const [bold, rest] = part.split('»');
                      return (
                        <span key={k}>
                          <strong>{bold}</strong>
                          {rest}
                        </span>
                      );
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
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-xs)',
            marginBottom: 'var(--space-md)',
            flexShrink: 0,
          }}
        >
          {AI_SUGGESTIONS.map((s) => (
            <button
              key={s}
              className="btn btn-secondary btn-sm"
              onClick={() => sendMessage(s)}
              style={{ fontSize: 'var(--text-xs)' }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-sm)',
          flexShrink: 0,
          background: 'var(--glass-bg)',
          borderRadius: 'var(--radius-full)',
          padding: 6,
          border: 'none',
        }}
      >
        <input
          className="input"
          style={{ border: 'none', background: 'none', borderRadius: 'var(--radius-full)' }}
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="btn btn-gold"
          style={{ borderRadius: 'var(--radius-full)', padding: '10px 20px' }}
          onClick={() => sendMessage()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
