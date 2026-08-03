'use client';
import { useApp } from '@/context/app-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getGreeting, formatCurrency, formatDate,
} from '@/lib/utils';
import { IconGive, IconTarget, IconClipboard, IconSparkles, OnlineLogoIcon } from '@/components/icons';

export default function MemberDashboard() {
  const { user, contributions, campaigns, events, announcements, settings } = useApp();
  const router = useRouter();

  const myContributions = contributions.filter(c => c.memberId === (user?.id || '1'));
  const myTotal = myContributions.filter(c => c.status === 'approved').reduce((s, c) => s + c.amount, 0);
  const monthlyGoal = 15000;
  const currency = settings?.['localization.localCurrency'] || 'RWF';
  const progress = Math.min(100, Math.round((myTotal / monthlyGoal) * 100));
  const circumference = 2 * Math.PI * 52;

  return (
    <div className="page-member-content flex-col gap-xl">
      <style>{`
        @keyframes fadeUpIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dash-hero-card {
          background: rgba(15, 15, 22, 0.8);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border-radius: 32px;
          padding: 36px 40px;
          border: 1px solid rgba(212, 168, 67, 0.3);
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.8), inset 0 0 24px rgba(212, 168, 67, 0.05);
          animation: fadeUpIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) backwards;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }
        .dash-hero-card:hover {
          transform: scale(1.02);
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 32px 72px rgba(0, 0, 0, 0.9), inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -1px 2px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.05);
        }
        .dash-hero-card:active {
          animation: shakeOnActive 0.3s ease-in-out;
        }

        .scroll-row-container {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 8px 4px 20px 4px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .scroll-row-container::-webkit-scrollbar {
          height: 8px;
        }
        .scroll-row-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 999px;
        }
        .scroll-row-container::-webkit-scrollbar-thumb {
          background: rgba(212, 168, 67, 0.4);
          border-radius: 999px;
        }
        .scroll-row-container::-webkit-scrollbar-thumb:hover {
          background: var(--gold);
        }

        .big-scroll-card {
          min-width: 320px;
          max-width: 360px;
          flex-shrink: 0;
          scroll-snap-align: start;
          background: rgba(18, 18, 26, 0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(212, 168, 67, 0.3);
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
          cursor: pointer;
          animation: fadeUpIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) backwards;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .big-scroll-card:hover {
          transform: scale(1.03);
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -1px 2px rgba(255, 255, 255, 0.1), inset 0 0 16px rgba(255, 255, 255, 0.05);
        }
        .big-scroll-card:active {
          animation: shakeOnActive 0.3s ease-in-out;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .section-title {
          font-family: var(--font-display, 'Outfit'), sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #FFFFFF;
        }

        .quick-action-tile {
          background: rgba(18, 18, 26, 0.8);
          border: 1px solid rgba(212, 168, 67, 0.25);
          border-radius: 24px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          animation: fadeUpIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) backwards;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-align: center;
        }
        .quick-action-tile:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.25);
          transform: scale(1.05);
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 0 16px rgba(255, 255, 255, 0.05);
        }
        .quick-action-tile:active {
          animation: shakeOnActive 0.3s ease-in-out;
        }
        .quick-action-tile-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          margin-bottom: 8px;
        }

        .dash-hero-card svg, .big-scroll-card svg, .quick-action-tile svg {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dash-hero-card:hover svg, .big-scroll-card:hover svg, .quick-action-tile:hover svg {
          transform: scale(1.15);
        }
      `}</style>

      {/* Welcome Hero Card */}
      <div className="dash-hero-card">
        <p suppressHydrationWarning style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#D4A843', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
          {getGreeting()} <OnlineLogoIcon name="sun" size={16} />
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
          Welcome, {user?.name?.split(' ')[0] || 'Jean-Pierre'}
        </h1>
        <p style={{ fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.75)', fontSize: 16 }}>
          &ldquo;Arise, shine, for your light has come.&rdquo; &mdash; Isaiah 60:1
        </p>
      </div>



      {/* Quick Actions Grid */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
        </div>
        <div className="grid grid-4" style={{ gap: 16 }}>
          {[
            { icon: <IconTarget size={26} color="#D4A843" />, label: 'Campaigns', href: '/member/campaigns', bg: 'rgba(212,168,67,0.2)' },
            { icon: <IconClipboard size={26} color="#D4A843" />, label: 'Attendance', href: '/member/attendance', bg: 'rgba(212,168,67,0.2)' },
            { icon: <IconSparkles size={26} color="#D4A843" />, label: 'AI Assistant', href: '/member/ai', bg: 'rgba(212,168,67,0.2)' },
          ].map((action, i) => (
            <Link key={action.label} href={action.href} className="quick-action-tile" style={{ animationDelay: `${0.2 + (i * 0.1)}s`, textDecoration: 'none' }}>
              <div className="quick-action-tile-icon" style={{ background: action.bg }}>{action.icon}</div>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#FFFFFF' }}>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Active Campaigns (Horizontal Scroll Carousels) */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Active Campaigns</h2>
          <button className="btn btn-ghost" style={{ color: '#D4A843' }} onClick={() => router.push('/member/campaigns')}>
            View All ({campaigns.filter(c => c.status === 'active').length}) →
          </button>
        </div>

        <div className="scroll-row-container">
          {campaigns.filter(c => c.status === 'active').map((campaign, i) => {
            const pct = Math.round((campaign.raised / campaign.goal) * 100);
            return (
              <Link key={campaign.id} href="/member/campaigns" className="big-scroll-card" style={{ animationDelay: `${0.3 + (i * 0.1)}s`, textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ fontSize: 38, width: 56, height: 56, borderRadius: 16, background: 'rgba(212,168,67,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <OnlineLogoIcon name={campaign.image || "church"} size={30} color="var(--gold)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 17, color: '#FFFFFF', marginBottom: 2 }}>{campaign.title}</p>
                    <span className="badge badge-gold" style={{ fontSize: 11 }}>{pct}% Funded</span>
                  </div>
                </div>

                <div className="progress-bar" style={{ height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #B08A2E, #D4A843)', borderRadius: 999 }} />
                </div>

                <div className="flex-between" style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>
                  <span>Raised: <strong>{formatCurrency(campaign.raised, campaign.currency || currency)}</strong></span>
                  <span>Goal: {formatCurrency(campaign.goal, campaign.currency || currency)}</span>
                </div>

                <div className="btn btn-gold" style={{ width: '100%' }}>
                  Support Campaign
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events (Horizontal Scroll Carousels) */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Upcoming Events</h2>
          <button className="btn btn-ghost" style={{ color: '#D4A843' }} onClick={() => router.push('/member/attendance')}>
            All Events →
          </button>
        </div>

        <div className="scroll-row-container">
          {events.map((event, i) => {
            const d = new Date(event.date);
            return (
              <Link key={event.id} href="/member/attendance" className="big-scroll-card" style={{ minWidth: 280, maxWidth: 300, animationDelay: `${0.4 + (i * 0.1)}s`, textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
                  <div style={{
                    width: 52, height: 56, borderRadius: 14,
                    background: 'linear-gradient(180deg, #D4A843 0%, #A37A24 100%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: '#FFFFFF', fontWeight: 800,
                  }}>
                    <span style={{ fontSize: 20, lineHeight: 1 }}>{d.getDate()}</span>
                    <span style={{ fontSize: 10, textTransform: 'uppercase', opacity: 0.85 }}>{d.toLocaleDateString('en', { month: 'short' })}</span>
                  </div>
                  <div>
                    <span className="badge badge-gold" style={{ marginBottom: 4 }}>{event.category}</span>
                    <p style={{ fontWeight: 700, fontSize: 15, color: '#FFFFFF' }}>{event.title}</p>
                  </div>
                </div>

                <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>
                  <OnlineLogoIcon name="clock" size={14} /> {event.time} • <OnlineLogoIcon name="map-pin" size={14} /> 
                  <span style={{ color: 'inherit', textDecoration: 'underline' }}>
                    {event.location}
                  </span>
                </p>

                <div className="btn btn-secondary" style={{ width: '100%', borderColor: 'rgba(212, 168, 67, 0.3)' }}>
                  Confirm Attendance
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Latest Announcements (Horizontal Scroll Carousels) */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Latest Announcements</h2>
          <button className="btn btn-ghost" style={{ color: '#D4A843' }} onClick={() => router.push('/member/announcements')}>
            View All →
          </button>
        </div>

        <div className="scroll-row-container">
          {[...announcements].sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0)).map(ann => (
            <div key={ann.id} className="big-scroll-card" style={{ minWidth: 320, maxWidth: 360 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(212,168,67,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <OnlineLogoIcon name={ann.image || "megaphone"} size={24} color={ann.priority === 'high' ? 'var(--soft-red)' : 'var(--gold)'} />
                </div>
                <div>
                  <span className={`badge ${ann.priority === 'high' ? 'badge-red' : 'badge-gold'}`}>
                    {ann.priority.toUpperCase()} PRIORITY
                  </span>
                  <p style={{ fontWeight: 700, fontSize: 16, color: '#FFFFFF', marginTop: 4 }}>{ann.title}</p>
                </div>
              </div>

              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginBottom: 16 }}>
                {ann.description.substring(0, 110)}...
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'rgba(255,255,255,0.5)', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><OnlineLogoIcon name="calendar" size={12} /> {formatDate(ann.date)}</span>
                <span style={{ color: '#D4A843', cursor: 'pointer', fontWeight: 600 }} onClick={() => router.push('/member/announcements')}>Read More →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
