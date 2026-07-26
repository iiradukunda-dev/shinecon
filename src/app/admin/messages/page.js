'use client';
import { useApp } from '@/context/app-context';
import { formatDate } from '@/lib/utils';
import { OnlineLogoIcon } from '@/components/icons';

export default function AdminMessagesPage() {
  const { messages, deleteMessage, markMessageRead } = useApp();

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <h1>Messages</h1>
        <p>Member conversations and support • {messages.filter(m => m.unread).length} unread</p>
      </div>
      <div className="flex-col gap-sm animate-fade-in-up stagger-1">
        {messages.map(m => (
          <div key={m.id} className="glass-card" style={{
            padding: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
            cursor: 'pointer', opacity: m.unread ? 1 : 0.75,
          }} onClick={() => markMessageRead(m.id)}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
            }}>{m.from.split(' ').map(n => n[0]).join('')}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex-between">
                <span style={{ fontWeight: m.unread ? 700 : 500, fontSize: 'var(--text-sm)' }}>{m.from}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{formatDate(m.date)}</span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: m.unread ? 600 : 400, color: 'var(--text-secondary)' }}>{m.subject}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.lastMessage}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {m.unread && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gold)' }} />}
              <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); deleteMessage(m.id); }} style={{ color: 'var(--soft-red)' }} title="Delete"><OnlineLogoIcon name="trash-2" size={16} color="var(--soft-red)" /></button>
            </div>
          </div>
        ))}
      </div>
      {messages.length === 0 && (
        <div className="empty-state"><div className="empty-state-icon"><OnlineLogoIcon name="message-square" size={32} /></div><p className="empty-state-title">No messages</p><p className="empty-state-description">All clear!</p></div>
      )}
    </div>
  );
}
