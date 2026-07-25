'use client';
import { useApp } from '@/context/app-context';
import { formatDate } from '@/lib/utils';
import { OnlineLogoIcon } from '@/components/icons';

export default function AnnouncementsPage() {
  const { announcements } = useApp();
  return (
    <div className="page-member-content">
      <div className="page-header animate-fade-in-up">
        <h1>Announcements</h1>
        <p>Latest news and updates from Shining Ministries</p>
      </div>

      <div className="flex-col gap-md">
        {[...announcements].sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0)).map((ann, i) => (
          <div key={ann.id} className={`glass-card-static animate-fade-in-up stagger-${i + 1}`} style={{ padding: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(212,168,67,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <OnlineLogoIcon name={ann.image || 'megaphone'} size={28} color={ann.priority === 'high' ? 'var(--soft-red)' : 'var(--gold)'} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex-between" style={{ marginBottom: 'var(--space-sm)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)' }}>
                    {ann.title}
                  </h3>
                  <span className={`badge ${ann.priority === 'high' ? 'badge-red' : ann.priority === 'normal' ? 'badge-blue' : 'badge-gray'}`}>
                    {ann.priority}
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-sm)' }}>
                  {ann.description}
                </p>
                <div className="flex-between">
                  <span className="badge badge-gold">{ann.category}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{formatDate(ann.date)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
