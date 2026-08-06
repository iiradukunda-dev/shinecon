'use client';
import { useApp } from '@/context/app-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  formatCurrency,
  formatDate,
  getMonthlyContributionData,
  getMemberGrowth,
} from '@/lib/utils';
import { IconUsers, IconGive, IconDollar, IconHourglass, OnlineLogoIcon } from '@/components/icons';

export default function AdminDashboard() {
  const { stats, members, contributions, events } = useApp();
  const router = useRouter();

  const kpis = [
    {
      label: 'Total Members',
      value: stats.totalMembers,
      iconName: 'users',
      change: '+12% this month',
      positive: true,
      color: '#D4A843',
      href: '/admin/members',
    },
    {
      label: 'Monthly Contributions',
      value: formatCurrency(stats.monthlyRWF, 'RWF'),
      iconName: 'wallet',
      change: '+8% vs last month',
      positive: true,
      color: '#D4A843',
      href: '/admin/contributions',
    },
    {
      label: 'Pending Approvals',
      value: stats.pendingContributions + stats.pendingMembers,
      iconName: 'hourglass',
      change: 'Requires Action',
      positive: false,
      color: '#D4A843',
      href: '/admin/members',
    },
  ];

  const pendingContributions = contributions.filter((c) => c.status === 'pending');
  const pendingMembers = members.filter((m) => m.status === 'pending');

  const MONTHLY_CONTRIBUTION_DATA = getMonthlyContributionData(contributions);

  const MEMBER_GROWTH_DATA = getMemberGrowth(members);

  return (
    <div className="flex-col gap-xl">
      <style>{`
        @keyframes fadeUpIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .admin-hero-card {
          padding: 24px;
          cursor: pointer;
          animation: fadeUpIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) backwards;
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
          padding: 20px;
          cursor: pointer;
          animation: fadeUpIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>

      {/* KPI Big Clear Cards */}
      <div className="grid grid-3" style={{ gap: 20 }}>
        {kpis.map((kpi, i) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="glass-card admin-hero-card"
            style={{ animationDelay: `${i * 0.1}s`, textDecoration: 'none', display: 'block' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  border: '1px solid rgba(212, 168, 67, 0.6)',
                  boxShadow: "none",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <OnlineLogoIcon name={kpi.iconName} size={28} color={kpi.color} />
              </div>
              <span
                className={`badge ${kpi.positive ? 'badge-gold' : 'badge-amber'}`}
                style={{
                  fontSize: 12,
                  padding: '6px 12px',
                  background: 'rgba(212, 168, 67, 0.1)',
                  border: '1px solid rgba(212, 168, 67, 0.2)',
                }}
              >
                {kpi.positive ? (
                  <OnlineLogoIcon name="arrow-up" size={12} color="var(--gold)" />
                ) : (
                  <OnlineLogoIcon name="zap" size={12} color="var(--amber)" />
                )}{' '}
                <span style={{ marginLeft: 4 }}>{kpi.change}</span>
              </span>
            </div>

            <div
              style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 20 }}
            />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 42,
                  fontWeight: 800,
                  color: kpi.color,
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {kpi.value}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
                {kpi.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-2" style={{ gap: 20 }}>
        {/* Contribution Trend */}
        <Link
          href="/admin/contributions"
          className="glass-card admin-hero-card"
          style={{ animationDelay: '0.3s', textDecoration: 'none', display: 'block' }}
        >
          <div className="flex-between" style={{ marginBottom: 20 }}>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 18,
                color: '#FFFFFF',
              }}
            >
              Contribution Trend
            </h3>
            <span className="badge badge-gold">2026 Fiscal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
            {MONTHLY_CONTRIBUTION_DATA.labels.map((label, i) => {
              const maxVal = Math.max(...MONTHLY_CONTRIBUTION_DATA.local, 1);
              const height = (MONTHLY_CONTRIBUTION_DATA.local[i] / maxVal) * 100;
              const isLast = i === MONTHLY_CONTRIBUTION_DATA.labels.length - 1;
              return (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 10, color: '#D4A843', fontWeight: 600 }}>
                    {(MONTHLY_CONTRIBUTION_DATA.local[i] / 1000).toFixed(0)}K
                  </span>
                  <div
                    style={{
                      width: '100%',
                      height: `${height}%`,
                      borderRadius: '8px 8px 4px 4px',
                      background: isLast
                        ? 'linear-gradient(180deg, #E8C876 0%, #B08A2E 100%)'
                        : 'linear-gradient(180deg, rgba(212,168,67,0.4), rgba(212,168,67,0.15))',
                      minHeight: 8,
                    }}
                  />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{label}</span>
                </div>
              );
            })}
          </div>
        </Link>

        {/* Member Growth Chart */}
        <Link
          href="/admin/members"
          className="glass-card admin-hero-card"
          style={{ animationDelay: '0.4s', textDecoration: 'none', display: 'block' }}
        >
          <div className="flex-between" style={{ marginBottom: 20 }}>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 18,
                color: '#FFFFFF',
              }}
            >
              Member Growth Rate
            </h3>
            <span className="badge badge-gold">+12 New Members</span>
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
                const data = MEMBER_GROWTH_DATA.data;
                const max = Math.max(...data, 10) * 1.1;
                const points = data
                  .map((v, i) => {
                    const safeMax = max === 0 ? 1 : max;
                    return `${(i / (data.length - 1)) * 700},${140 - (v / safeMax) * 130}`;
                  })
                  .join(' ');
                const areaPoints = points + ` 700,140 0,140`;
                return (
                  <>
                    <polygon points={areaPoints} fill="url(#adminLineGrad)" />
                    <polyline
                      points={points}
                      fill="none"
                      stroke="#D4A843"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {data.map((v, i) => (
                      <circle
                        key={i}
                        cx={(i / (data.length - 1)) * 700}
                        cy={140 - (v / max) * 130}
                        r="5"
                        fill="#FFFFFF"
                        stroke="#D4A843"
                        strokeWidth="3"
                      />
                    ))}
                  </>
                );
              })()}
            </svg>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginTop: 12,
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: 12,
              }}
            >
              {MEMBER_GROWTH_DATA.labels.map((l) => (
                <span key={l} style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                  {l}
                </span>
              ))}
            </div>
          </div>
        </Link>
      </div>

      {/* Upcoming Events (Horizontal Scroll Row) */}
      <div>
        <div className="flex-between" style={{ marginBottom: 16 }}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 20,
              color: '#FFFFFF',
            }}
          >
            Upcoming Ministry Events
          </h3>
          <button
            className="btn btn-ghost"
            style={{ color: '#D4A843' }}
            onClick={() => router.push('/admin/events')}
          >
            Manage Events →
          </button>
        </div>

        <div className="scroll-admin-row">
          {events.map((event, i) => {
            const d = new Date(event.date);
            return (
              <Link
                key={event.id}
                href="/admin/events"
                className="glass-card admin-scroll-card"
                style={{
                  animationDelay: `${0.4 + i * 0.1}s`,
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                <div className="flex-between" style={{ marginBottom: 12 }}>
                  <span className="badge badge-gold">{event.category}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{event.time}</span>
                </div>
                <p style={{ fontWeight: 700, fontSize: 16, color: '#FFFFFF', marginBottom: 6 }}>
                  {event.title}
                </p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 14 }}>
                  <OnlineLogoIcon name="calendar" size={14} color="var(--gold)" />{' '}
                  {d.toLocaleDateString('en', { month: 'short', day: 'numeric' })} •{' '}
                  <OnlineLogoIcon name="map-pin" size={14} color="var(--gold)" />
                  <span style={{ color: 'inherit', textDecoration: 'underline' }}>
                    {event.location}
                  </span>
                </p>
                <div
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '8px 14px', fontSize: 13, textAlign: 'center' }}
                >
                  Event Details
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
