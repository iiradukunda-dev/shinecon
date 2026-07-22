'use client';
import { useApp } from '@/context/app-context';
import { useRouter } from 'next/navigation';
import {
  formatCurrency, formatDate,
  MONTHLY_CONTRIBUTION_DATA, ATTENDANCE_TREND, MEMBER_GROWTH,
  CONTRIBUTION_BY_CATEGORY,
} from '@/lib/demo-data';

export default function AdminDashboard() {
  const { stats, members, contributions, events } = useApp();
  const router = useRouter();

  const kpis = [
    { label: 'Total Members', value: stats.totalMembers, icon: '👥', change: '+12%', positive: true, bg: 'rgba(212,168,67,0.1)', color: 'var(--gold)' },
    { label: 'Monthly (RWF)', value: formatCurrency(stats.monthlyRWF, 'RWF'), icon: '💰', change: '+8%', positive: true, bg: 'rgba(43,138,62,0.1)', color: 'var(--emerald)' },
    { label: 'Monthly (USD)', value: formatCurrency(stats.monthlyUSD, 'USD'), icon: '💵', change: '+15%', positive: true, bg: 'rgba(59,91,219,0.1)', color: 'var(--royal-blue)' },
    { label: 'Pending Approvals', value: stats.pendingContributions + stats.pendingMembers, icon: '⏳', change: 'Action needed', positive: false, bg: 'rgba(245,159,0,0.1)', color: 'var(--amber)' },
  ];

  const pendingContributions = contributions.filter(c => c.status === 'pending');
  const pendingMembers = members.filter(m => m.status === 'pending');

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        {kpis.map((kpi, i) => (
          <div key={kpi.label} className={`stat-card glass-card-static animate-fade-in-up stagger-${i + 1}`}>
            <div className="stat-icon" style={{ background: kpi.bg }}>
              <span>{kpi.icon}</span>
            </div>
            <div className="stat-value">{kpi.value}</div>
            <div className="stat-label">{kpi.label}</div>
            <div className={`stat-change ${kpi.positive ? 'positive' : 'negative'}`}>
              {kpi.positive ? '↑' : '⚡'} {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        {/* Contribution Trend */}
        <div className="glass-card-static animate-fade-in-up stagger-3" style={{ padding: 'var(--space-lg)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Contribution Trend</h3>
            <span className="badge badge-gold">2026</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140 }}>
            {MONTHLY_CONTRIBUTION_DATA.labels.map((label, i) => {
              const maxVal = Math.max(...MONTHLY_CONTRIBUTION_DATA.local);
              const height = (MONTHLY_CONTRIBUTION_DATA.local[i] / maxVal) * 100;
              const isLast = i === MONTHLY_CONTRIBUTION_DATA.labels.length - 1;
              return (
                <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                    {(MONTHLY_CONTRIBUTION_DATA.local[i] / 1000).toFixed(0)}K
                  </span>
                  <div style={{
                    width: '100%', height: `${height}%`, borderRadius: '8px 8px 4px 4px',
                    background: isLast
                      ? 'linear-gradient(180deg, var(--gold), var(--gold-dark))'
                      : 'linear-gradient(180deg, rgba(212,168,67,0.3), rgba(212,168,67,0.1))',
                    transition: 'height 1.2s var(--ease-out)',
                    minHeight: 8,
                  }} />
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Member Growth */}
        <div className="glass-card-static animate-fade-in-up stagger-4" style={{ padding: 'var(--space-lg)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Member Growth</h3>
            <span className="badge badge-green">+12 this month</span>
          </div>
          <div style={{ position: 'relative', height: 140 }}>
            <svg viewBox="0 0 700 140" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--emerald)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--emerald)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const data = MEMBER_GROWTH.data;
                const max = Math.max(...data) * 1.1;
                const points = data.map((v, i) => `${(i / (data.length - 1)) * 700},${140 - (v / max) * 130}`).join(' ');
                const areaPoints = points + ` 700,140 0,140`;
                return (
                  <>
                    <polygon points={areaPoints} fill="url(#lineGrad)" />
                    <polyline points={points} fill="none" stroke="var(--emerald)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    {data.map((v, i) => (
                      <circle key={i} cx={(i / (data.length - 1)) * 700} cy={140 - (v / max) * 130} r="4" fill="var(--emerald)" stroke="var(--bg-secondary)" strokeWidth="2" />
                    ))}
                  </>
                );
              })()}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {MEMBER_GROWTH.labels.map(l => (
                <span key={l} style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-3" style={{ marginBottom: 'var(--space-xl)' }}>
        {/* Local vs Diaspora */}
        <div className="glass-card-static animate-fade-in-up stagger-5" style={{ padding: 'var(--space-lg)' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Local vs Diaspora</h4>
          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="16" fill="none" stroke="var(--border-light)" strokeWidth="3" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="var(--gold)" strokeWidth="3"
                  strokeDasharray={`${(stats.localMembers / stats.totalMembers) * 100} ${100 - (stats.localMembers / stats.totalMembers) * 100}`}
                  strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gold)' }} />
                <span style={{ fontSize: 'var(--text-sm)' }}>Local: {stats.localMembers}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--royal-blue)' }} />
                <span style={{ fontSize: 'var(--text-sm)' }}>Diaspora: {stats.diasporaMembers}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Student vs Employed */}
        <div className="glass-card-static animate-fade-in-up stagger-5" style={{ padding: 'var(--space-lg)' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Employment Status</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {[
              { label: 'Employed', count: stats.employedMembers, pct: Math.round((stats.employedMembers / stats.totalMembers) * 100), color: 'var(--emerald)' },
              { label: 'Students', count: stats.studentMembers, pct: Math.round((stats.studentMembers / stats.totalMembers) * 100), color: 'var(--royal-blue)' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex-between" style={{ marginBottom: 4, fontSize: 'var(--text-sm)' }}>
                  <span>{item.label}</span>
                  <span style={{ fontWeight: 600 }}>{item.count} ({item.pct}%)</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance */}
        <div className="glass-card-static animate-fade-in-up stagger-5" style={{ padding: 'var(--space-lg)' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Attendance</h4>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
            {ATTENDANCE_TREND.data.map((v, i) => {
              const max = Math.max(...ATTENDANCE_TREND.data);
              return (
                <div key={i} style={{
                  flex: 1, height: `${(v / max) * 100}%`, borderRadius: '4px 4px 2px 2px',
                  background: i === ATTENDANCE_TREND.data.length - 1
                    ? 'linear-gradient(180deg, var(--royal-blue), var(--royal-blue-light))'
                    : 'rgba(59,91,219,0.15)',
                  minHeight: 4,
                }} />
              );
            })}
          </div>
          <div className="flex-between" style={{ marginTop: 8 }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Jan</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Jul</span>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 8 }}>
            Avg: <strong>{Math.round(ATTENDANCE_TREND.data.reduce((a, b) => a + b) / ATTENDANCE_TREND.data.length)}</strong> per service
          </p>
        </div>
      </div>

      {/* Pending Actions */}
      <div className="grid grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        {/* Pending Members */}
        <div className="glass-card-static animate-fade-in-up" style={{ padding: 'var(--space-lg)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Pending Members</h3>
            <span className="badge badge-amber">{pendingMembers.length}</span>
          </div>
          {pendingMembers.length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>No pending approvals 🎉</p>
          ) : pendingMembers.map(m => (
            <div key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
              padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--border-light)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 12, fontWeight: 700,
              }}>{m.name.split(' ').map(n => n[0]).join('')}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{m.name}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{m.email}</p>
              </div>
              <button className="btn btn-gold btn-sm" onClick={() => router.push('/admin/members')}>
                Review
              </button>
            </div>
          ))}
        </div>

        {/* Pending Contributions */}
        <div className="glass-card-static animate-fade-in-up" style={{ padding: 'var(--space-lg)' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Pending Contributions</h3>
            <span className="badge badge-amber">{pendingContributions.length}</span>
          </div>
          {pendingContributions.length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>All caught up! 🎉</p>
          ) : pendingContributions.map(c => (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
              padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--border-light)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-md)',
                background: 'rgba(245,159,0,0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>💰</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{c.memberName}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{c.type} • {formatDate(c.date)}</p>
              </div>
              <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--gold-dark)' }}>
                {formatCurrency(c.amount, c.currency)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="glass-card-static animate-fade-in-up" style={{ padding: 'var(--space-lg)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
          Upcoming Events
        </h3>
        <div style={{ display: 'flex', gap: 'var(--space-md)', overflowX: 'auto', paddingBottom: 4 }}>
          {events.slice(0, 4).map(event => {
            const d = new Date(event.date);
            return (
              <div key={event.id} style={{
                minWidth: 200, padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)',
              }}>
                <div className="flex-between" style={{ marginBottom: 'var(--space-sm)' }}>
                  <span className="badge badge-gold">{event.category}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{event.time}</span>
                </div>
                <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 4 }}>{event.title}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                  {d.toLocaleDateString('en', { month: 'short', day: 'numeric' })} • {event.location}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
