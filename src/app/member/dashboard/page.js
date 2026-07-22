'use client';
import { useApp } from '@/context/app-context';
import { useRouter } from 'next/navigation';
import {
  getGreeting, formatCurrency, formatDate,
  MONTHLY_CONTRIBUTION_DATA,
} from '@/lib/demo-data';

export default function MemberDashboard() {
  const { user, contributions, campaigns, events, announcements, stats } = useApp();
  const router = useRouter();

  const myContributions = contributions.filter(c => c.memberId === (user?.id || '1'));
  const myTotal = myContributions.filter(c => c.status === 'approved').reduce((s, c) => s + c.amount, 0);
  const monthlyGoal = user?.type === 'diaspora' ? 100 : 15000;
  const currency = user?.type === 'diaspora' ? 'USD' : 'RWF';
  const progress = Math.min(100, Math.round((myTotal / monthlyGoal) * 100));

  const circumference = 2 * Math.PI * 52;

  return (
    <div className="page-member-content">
      {/* Welcome Card */}
      <div className="welcome-card animate-fade-in-up" style={{ marginBottom: 'var(--space-lg)' }}>
        <p className="welcome-greeting">{getGreeting()} 🌅</p>
        <h2 className="welcome-name">{user?.name || 'Jean-Pierre'}</h2>
        <p className="welcome-scripture">
          &ldquo;Arise, shine, for your light has come.&rdquo; — Isaiah 60:1
        </p>
      </div>

      {/* Contribution Summary */}
      <div className="glass-card-static animate-fade-in-up stagger-1" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>
              My Contributions
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 800, lineHeight: 1 }}>
              {formatCurrency(myTotal, currency)}
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
              This year • {myContributions.length} transactions
            </p>
          </div>
          <div className="progress-circle">
            <svg viewBox="0 0 120 120">
              <circle className="track" cx="60" cy="60" r="52" />
              <circle className="fill" cx="60" cy="60" r="52"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * progress / 100)}
              />
            </svg>
            <div className="value">
              <span style={{ fontSize: 'var(--text-2xl)' }}>{progress}%</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>goal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions animate-fade-in-up stagger-2" style={{ marginBottom: 'var(--space-xl)' }}>
        {[
          { icon: '💰', label: 'Contribute', href: '/member/contributions', bg: 'rgba(212,168,67,0.12)' },
          { icon: '🎯', label: 'Campaigns', href: '/member/campaigns', bg: 'rgba(59,91,219,0.12)' },
          { icon: '📋', label: 'Attendance', href: '/member/attendance', bg: 'rgba(43,138,62,0.12)' },
          { icon: '✨', label: 'AI Help', href: '/member/ai', bg: 'rgba(156,54,181,0.12)' },
        ].map(action => (
          <button key={action.label} className="quick-action" onClick={() => router.push(action.href)}>
            <div className="quick-action-icon" style={{ background: action.bg }}>{action.icon}</div>
            <span className="quick-action-label">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Monthly Trend - Simple Bar Chart */}
      <div className="glass-card-static animate-fade-in-up stagger-3" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-md)', fontSize: 'var(--text-base)' }}>
          Monthly Contributions
        </h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
          {MONTHLY_CONTRIBUTION_DATA.labels.map((label, i) => {
            const maxVal = Math.max(...MONTHLY_CONTRIBUTION_DATA.local);
            const height = (MONTHLY_CONTRIBUTION_DATA.local[i] / maxVal) * 100;
            const isLast = i === MONTHLY_CONTRIBUTION_DATA.labels.length - 1;
            return (
              <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', height: `${height}%`, borderRadius: '6px 6px 2px 2px',
                  background: isLast
                    ? 'linear-gradient(180deg, var(--gold), var(--gold-dark))'
                    : 'var(--border-medium)',
                  transition: 'height 1s var(--ease-out)',
                  minHeight: 4,
                }} />
                <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="animate-fade-in-up stagger-4" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Active Campaigns</h3>
          <button className="btn btn-ghost body-sm" onClick={() => router.push('/member/campaigns')}>See all →</button>
        </div>
        {campaigns.filter(c => c.status === 'active').slice(0, 2).map(campaign => {
          const pct = Math.round((campaign.raised / campaign.goal) * 100);
          return (
            <div key={campaign.id} className="glass-card-static" style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
              <div className="flex-between" style={{ marginBottom: 'var(--space-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span style={{ fontSize: 28 }}>{campaign.image}</span>
                  <div>
                    <p style={{ fontWeight: 600 }}>{campaign.title}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{campaign.contributors} contributors</p>
                  </div>
                </div>
                <span className="badge badge-gold">{pct}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex-between" style={{ marginTop: 6, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                <span>{formatCurrency(campaign.raised, campaign.currency)}</span>
                <span>{formatCurrency(campaign.goal, campaign.currency)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Events */}
      <div className="animate-fade-in-up stagger-5" style={{ marginBottom: 'var(--space-lg)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
          Upcoming Events
        </h3>
        <div className="flex-col gap-sm">
          {events.slice(0, 3).map(event => {
            const d = new Date(event.date);
            return (
              <div key={event.id} className="event-card">
                <div className="event-date-block">
                  <span className="event-date-day">{d.getDate()}</span>
                  <span className="event-date-month">{d.toLocaleDateString('en', { month: 'short' })}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{event.title}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    {event.time} • {event.location}
                  </p>
                </div>
                <span className="badge badge-gold">{event.category}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Latest Announcements */}
      <div className="animate-fade-in-up stagger-6">
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
          Announcements
        </h3>
        {announcements.slice(0, 2).map(ann => (
          <div key={ann.id} className="glass-card-static" style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 28 }}>{ann.image}</span>
              <div style={{ flex: 1 }}>
                <div className="flex-between" style={{ marginBottom: 4 }}>
                  <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{ann.title}</p>
                  <span className={`badge ${ann.priority === 'high' ? 'badge-red' : 'badge-gray'}`}>
                    {ann.priority}
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {ann.description.substring(0, 100)}...
                </p>
                <p style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4 }}>
                  {formatDate(ann.date)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
