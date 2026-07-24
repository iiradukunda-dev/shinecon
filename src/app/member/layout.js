'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { useEffect, useState } from 'react';
import {
  IconHome, IconGive, IconTarget, IconClipboard, IconMegaphone, IconSparkles, IconUser
} from '@/components/icons';

const NAV_ITEMS = [
  { href: '/member/dashboard', icon: <IconHome size={18} />, label: 'Home' },
  { href: '/member/contributions', icon: <IconGive size={18} />, label: 'Give' },
  { href: '/member/campaigns', icon: <IconTarget size={18} />, label: 'Campaigns' },
  { href: '/member/attendance', icon: <IconClipboard size={18} />, label: 'Attendance' },
  { href: '/member/announcements', icon: <IconMegaphone size={18} />, label: 'Announcements' },
  { href: '/member/ai', icon: <IconSparkles size={18} />, label: 'AI Help' },
  { href: '/member/profile', icon: <IconUser size={18} />, label: 'Profile' },
];

export default function MemberLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, toasts, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="page-member" style={{ background: '#0A0A0E', minHeight: '100vh', color: '#FFFFFF' }}>
      {/* Demo Banner */}
      <div className="demo-banner">✦ DEMO MODE — SM Connect ✦</div>

      {/* Top Navigation Bar */}
      <header className="member-top-nav">
        <style>{`
          .member-top-nav {
            position: fixed;
            top: 28px;
            left: 0;
            right: 0;
            height: 68px;
            z-index: 200;
            padding: 0 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(12, 12, 18, 0.85);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border-bottom: 1px solid rgba(212, 168, 67, 0.3);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
          }

          .member-brand {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
          }
          .member-brand-logo {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            overflow: hidden;
            flex-shrink: 0;
            filter: drop-shadow(0 0 6px rgba(212, 168, 67, 0.4));
          }
          .member-brand-title {
            font-family: var(--font-display, 'Outfit'), sans-serif;
            font-weight: 800;
            font-size: 22px;
            color: #D4A843;
            letter-spacing: 0.5px;
          }

          .member-nav-links {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .member-nav-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            border-radius: 999px;
            font-size: 16px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.85);
            transition: all 0.2s ease;
            background: transparent;
            border: none;
            cursor: pointer;
            text-decoration: none;
          }
          .member-nav-item:hover {
            color: #FFFFFF;
            background: rgba(255, 255, 255, 0.1);
          }
          .member-nav-item.active {
            color: #D4A843;
            background: rgba(212, 168, 67, 0.2);
            border: 1px solid rgba(212, 168, 67, 0.4);
            font-weight: 700;
          }

          .member-nav-right {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .user-avatar-pill {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 16px 8px 10px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(212, 168, 67, 0.35);
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .user-avatar-pill:hover {
            background: rgba(212, 168, 67, 0.2);
            border-color: #D4A843;
          }
          .avatar-circle {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: linear-gradient(180deg, #D4A843 0%, #A37A24 100%);
            color: #FFFFFF;
            font-weight: 800;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .avatar-name {
            font-size: 15px;
            font-weight: 600;
            color: #FFFFFF;
          }

          .btn-logout-nav {
            padding: 9px 16px;
            border-radius: 999px;
            background: rgba(224, 49, 49, 0.15);
            border: 1px solid rgba(224, 49, 49, 0.35);
            color: #FF6B6B;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .btn-logout-nav:hover {
            background: rgba(224, 49, 49, 0.25);
            color: #FFFFFF;
          }

          .mobile-toggle-btn {
            display: none;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(212, 168, 67, 0.3);
            color: #D4A843;
            font-size: 20px;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }

          .mobile-nav-drawer {
            position: fixed;
            top: 96px;
            left: 16px;
            right: 16px;
            background: rgba(15, 15, 22, 0.95);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            border: 1px solid rgba(212, 168, 67, 0.35);
            border-radius: 24px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            z-index: 199;
            box-shadow: 0 24px 64px rgba(0, 0, 0, 0.9);
            animation: fadeInDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @media (max-width: 900px) {
            .member-nav-links { display: none; }
            .user-avatar-pill .avatar-name { display: none; }
            .mobile-toggle-btn { display: flex; }
          }
        `}</style>

        {/* Brand */}
        <div className="member-brand" onClick={() => router.push('/member/dashboard')}>
          <div className="member-brand-logo">
            <img src="/logo.png" alt="SM" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span className="member-brand-title">SM Connect</span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="member-nav-links">
          {NAV_ITEMS.map(item => (
            <button
              key={item.href}
              className={`member-nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => router.push(item.href)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="member-nav-right">
          <div className="user-avatar-pill" onClick={() => router.push('/member/profile')} title="View Profile">
            <div className="avatar-circle">
              {(user?.name || 'M')[0]}
            </div>
            <span className="avatar-name">{user?.name?.split(' ')[0] || 'Member'}</span>
          </div>

          <button className="btn-logout-nav" onClick={() => { logout(); router.push('/login'); }}>
            Logout
          </button>

          <button className="mobile-toggle-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          {NAV_ITEMS.map(item => (
            <button
              key={item.href}
              className={`member-nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => { router.push(item.href); setMobileMenuOpen(false); }}
              style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px' }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 15 }}>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main style={{ paddingTop: 112, paddingBottom: 48, maxWidth: 1200, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}>
        {children}
      </main>

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(t => (
            <div key={t.id} className="toast" style={{
              borderLeft: `4px solid ${t.type === 'success' ? 'var(--emerald)' : t.type === 'error' ? 'var(--soft-red)' : 'var(--gold)'}`,
            }}>
              {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'} {t.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
