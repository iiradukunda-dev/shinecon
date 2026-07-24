'use client';
import { useApp } from '@/context/app-context';
import { formatDate } from '@/lib/demo-data';

export default function AnnouncementsPage() {
  const { announcements } = useApp();
  return (
    <div className="page-member-content">
      <div className="page-header animate-fade-in-up">
        <h1>Announcements</h1>
        <p>Latest news and updates from Shining Ministries</p>
      </div>

      <div className="flex-col gap-md">
        {announcements.map((ann, i) => (
          <div key={ann.id} className={`glass-card-static animate-fade-in-up stagger-${i + 1}`} style={{ padding: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
              {typeof ann.image === 'string' && ann.image.startsWith('http') ? (
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(212,168,67,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src={ann.image} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                </div>
              ) : (
                <span style={{ fontSize: 36 }}>{ann.image}</span>
              )}
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
