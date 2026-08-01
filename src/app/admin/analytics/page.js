'use client';
import {
  getMonthlyContributionData, getAttendanceTrend, getMemberGrowth,
  getContributionByCategory,
} from '@/lib/utils';
import { useApp } from '@/context/app-context';
import { OnlineLogoIcon } from '@/components/icons';

export default function AnalyticsPage() {
  const { stats, members, contributions, contributionTypes } = useApp();

  const MONTHLY_CONTRIBUTION_DATA = getMonthlyContributionData(contributions);
  const MEMBER_GROWTH_DATA = getMemberGrowth(members);
  const CONTRIBUTION_BY_CATEGORY_DATA = getContributionByCategory(contributions, contributionTypes);

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <h1>Analytics Center</h1>
        <p>Enterprise business intelligence for Shining Ministries</p>
      </div>

      {/* Revenue Overview */}
      <div className="glass-card-static animate-fade-in-up stagger-1" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
        <div className="flex-between" style={{ marginBottom: 'var(--space-xl)' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)' }}>Revenue Trend (RWF)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Monthly contribution volume</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <span className="badge badge-gold">2026</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 200 }}>
          {MONTHLY_CONTRIBUTION_DATA.labels.map((label, i) => {
            const maxVal = Math.max(...MONTHLY_CONTRIBUTION_DATA.local, 1);
            const height = (MONTHLY_CONTRIBUTION_DATA.local[i] / maxVal) * 100;
            const isLast = i === MONTHLY_CONTRIBUTION_DATA.labels.length - 1;
            return (
              <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {(MONTHLY_CONTRIBUTION_DATA.local[i] / 1000).toFixed(0)}K
                </span>
                <div style={{
                  width: '100%', maxWidth: 60, height: `${height}%`, borderRadius: '10px 10px 4px 4px',
                  background: isLast
                    ? 'linear-gradient(180deg, var(--gold), var(--gold-dark))'
                    : 'linear-gradient(180deg, rgba(212,168,67,0.25), rgba(212,168,67,0.08))',
                  transition: 'height 1.5s var(--ease-out)',
                  minHeight: 8,
                }} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontWeight: 500 }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        {/* Category Distribution */}
        <div className="glass-card-static animate-fade-in-up stagger-2" style={{ padding: 'var(--space-xl)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
            Contribution Categories
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {CONTRIBUTION_BY_CATEGORY_DATA.labels.map((label, i) => (
              <div key={label}>
                <div className="flex-between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{CONTRIBUTION_BY_CATEGORY_DATA.data[i]}%</span>
                </div>
                <div className="progress-bar" style={{ height: 6 }}>
                  <div className="progress-bar-fill" style={{
                    width: `${CONTRIBUTION_BY_CATEGORY_DATA.data[i]}%`,
                    background: CONTRIBUTION_BY_CATEGORY_DATA.colors[i],
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Growth Chart */}
        <div className="glass-card-static animate-fade-in-up stagger-3" style={{ padding: 'var(--space-xl)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
            Member Growth
          </h3>
          <div style={{ height: 180 }}>
            <svg viewBox="0 0 700 180" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const data = MEMBER_GROWTH_DATA.data;
                const max = Math.max(...data, 1) * 1.15;
                const pts = data.map((v, i) => `${(i / (data.length - 1)) * 700},${170 - (v / max) * 160}`).join(' ');
                return (
                  <>
                    <polygon points={pts + ' 700,170 0,170'} fill="url(#growthGrad)" />
                    <polyline points={pts} fill="none" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    {data.map((v, i) => (
                      <g key={i}>
                        <circle cx={(i / (data.length - 1)) * 700} cy={170 - (v / max) * 160} r="5" fill="var(--gold)" stroke="var(--bg-secondary)" strokeWidth="2" />
                        <text x={(i / (data.length - 1)) * 700} y={170 - (v / max) * 160 - 12} textAnchor="middle" fontSize="11" fill="var(--text-secondary)" fontWeight="600">
                          {v}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {MEMBER_GROWTH_DATA.labels.map(l => (
              <span key={l} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-4 animate-fade-in-up stagger-4">
        {[
          { label: 'Avg Contribution (RWF)', value: '3,571 RWF', icon: 'bar-chart-2', color: 'var(--gold)' },
          { label: 'Attendance Rate', value: '81.2%', icon: 'clipboard-list', color: 'var(--emerald)' },
          { label: 'Campaign Success', value: '87%', icon: 'target', color: 'var(--royal-blue)' },
          { label: 'Member Retention', value: '94.3%', icon: 'gem', color: 'var(--amber)' },
        ].map(s => (
          <div key={s.label} className="glass-card-static" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
            <span style={{ display: 'block', marginBottom: 'var(--space-sm)' }}><OnlineLogoIcon name={s.icon} size={32} /></span>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-2xl)', color: s.color }}>
              {s.value}
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
