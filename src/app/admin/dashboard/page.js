'use client';
import { useApp } from '@/context/app-context';
import { useRouter } from 'next/navigation';
import {
  formatCurrency, formatDate,
  MONTHLY_CONTRIBUTION_DATA, ATTENDANCE_TREND, MEMBER_GROWTH,
} from '@/lib/demo-data';
import { IconUsers, IconGive, IconDollar, IconHourglass, OnlineLogoIcon } from '@/components/icons';

export default function AdminDashboard() {
  const { stats, members, contributions, events } = useApp();
  const router = useRouter();

  const kpis = [
    { label: 'Total Members', value: stats.totalMembers, icon: <IconUsers size={24} color="#D4A843" />, change: '+12% this month', positive: true, bg: 'rgba(212,168,67,0.15)', color: 'var(--gold)' },
    { label: 'Monthly Contributions (RWF)', value: formatCurrency(stats.monthlyRWF, 'RWF'), icon: <IconGive size={24} color="#40C057" />, change: '+8% vs last month', positive: true, bg: 'rgba(43,138,62,0.15)', color: 'var(--emerald)' },
    { label: 'Pending Approvals', value: stats.pendingContributions + stats.pendingMembers, icon: <IconHourglass size={24} color="#FAB005" />, change: 'Requires Action', positive: false, bg: 'rgba(245,159,0,0.15)', color: 'var(--amber)' },
  ];

  const pendingContributions = contributions.filter(c => c.status === 'pending');
  const pendingMembers = members.filter(m => m.status === 'pending');

  return (
    <div className="flex-col gap-xl">
      <style>{`
        .admin-hero-card {
          background: rgba(15, 15, 22, 0.85);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border-radius: 28px;
          padding: 28px;
          border: 1px solid rgba(212, 168, 67, 0.35);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.7);
        }

        .scroll-admin-row {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 4px 4px 16px 4px;
          scroll-snap-type: x mandatory;
        }
        .scroll-admin-row::-webkit-scrollbar {
          height: 6px;
        }
        .scroll-admin-row::-webkit-scrollbar-thumb {
          background: rgba(212, 168, 67, 0.4);
          border-radius: 999px;
        }

        .admin-scroll-card {
          min-width: 280px;
          max-width: 320px;
          flex-shrink: 0;
          scroll-snap-align: start;
          background: rgba(18, 18, 26, 0.85);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(212, 168, 67, 0.3);
          border-radius: 24px;
          padding: 20px;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
        }
      `}</style>

      {/* KPI Big Clear Cards */}
      <div className="grid grid-4" style={{ gap: 20 }}>
        {kpis.map((kpi, i) => (
          <div key={kpi.label} className="admin-hero-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                {kpi.icon}
              </div>
              <span className={`badge ${kpi.positive ? 'badge-gold' : 'badge-amber'}`} style={{ fontSize: 11 }}>
                {kpi.positive ? <OnlineLogoIcon name="arrow-up" size={12} color="var(--gold)" /> : <OnlineLogoIcon name="zap" size={12} color="var(--amber)" />} {kpi.change}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: '#D4A843', marginBottom: 4 }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.75)', fontWeight: 500 }}>
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-2" style={{ gap: 20 }}>
        {/* Contribution Trend */}
        <div className="admin-hero-card">
          <div className="flex-between" style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#FFFFFF' }}>Contribution Trend</h3>
            <span className="badge badge-gold">2026 Fiscal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
            {MONTHLY_CONTRIBUTION_DATA.labels.map((label, i) => {
              const maxVal = Math.max(...MONTHLY_CONTRIBUTION_DATA.local);
              const height = (MONTHLY_CONTRIBUTION_DATA.local[i] / maxVal) * 100;
              const isLast = i === MONTHLY_CONTRIBUTION_DATA.labels.length - 1;
              return (
                <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, color: '#D4A843', fontWeight: 600 }}>
                    {(MONTHLY_CONTRIBUTION_DATA.local[i] / 1000).toFixed(0)}K
                  </span>
                  <div style={{
                    width: '100%', height: `${height}%`, borderRadius: '8px 8px 4px 4px',
                    background: isLast
                      ? 'linear-gradient(180deg, #E8C876 0%, #B08A2E 100%)'
                      : 'linear-gradient(180deg, rgba(212,168,67,0.4), rgba(212,168,67,0.15))',
                    minHeight: 8,
                  }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Member Growth Chart */}
        <div className="admin-hero-card">
          <div className="flex-between" style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#FFFFFF' }}>Member Growth Rate</h3>
            <span className="badge badge-green">+12 New Members</span>
          </div>
          <div style={{ position: 'relative', height: 160 }}>
            <svg viewBox="0 0 700 140" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="adminLineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4A843" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#D4A843" stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const data = MEMBER_GROWTH.data;
                const max = Math.max(...data) * 1.1;
                const points = data.map((v, i) => `${(i / (data.length - 1)) * 700},${140 - (v / max) * 130}`).join(' ');
                const areaPoints = points + ` 700,140 0,140`;
                return (
                  <>
                    <polygon points={areaPoints} fill="url(#adminLineGrad)" />
                    <polyline points={points} fill="none" stroke="#D4A843" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    {data.map((v, i) => (
                      <circle key={i} cx={(i / (data.length - 1)) * 700} cy={140 - (v / max) * 130} r="5" fill="#FFFFFF" stroke="#D4A843" strokeWidth="3" />
                    ))}
                  </>
                );
              })()}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {MEMBER_GROWTH.labels.map(l => (
                <span key={l} style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events (Horizontal Scroll Row) */}
      <div>
        <div className="flex-between" style={{ marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: '#FFFFFF' }}>
            Upcoming Ministry Events
          </h3>
          <button className="btn btn-ghost" style={{ color: '#D4A843' }} onClick={() => router.push('/admin/events')}>
            Manage Events →
          </button>
        </div>

        <div className="scroll-admin-row">
          {events.map(event => {
            const d = new Date(event.date);
            return (
              <div key={event.id} className="admin-scroll-card">
                <div className="flex-between" style={{ marginBottom: 12 }}>
                  <span className="badge badge-gold">{event.category}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{event.time}</span>
                </div>
                <p style={{ fontWeight: 700, fontSize: 16, color: '#FFFFFF', marginBottom: 6 }}>{event.title}</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 14 }}>
                  <OnlineLogoIcon name="calendar" size={14} color="var(--gold)" /> {d.toLocaleDateString('en', { month: 'short', day: 'numeric' })} • <OnlineLogoIcon name="map-pin" size={14} color="var(--emerald)" /> {event.location}
                </p>
                <button className="btn btn-secondary" style={{ width: '100%', padding: '8px 14px', fontSize: 13 }} onClick={() => router.push('/admin/events')}>
                  Event Details
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
