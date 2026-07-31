'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { useEffect, useState } from 'react';
import {
  IconHome, IconGive, IconTarget, IconClipboard, IconMegaphone, IconSparkles, IconUser, OnlineLogoIcon
} from '@/components/icons';

const NAV_ITEMS = [
  { href: '/member/dashboard', icon: <IconHome size={20} />, label: 'Home' },
  { href: '/member/campaigns', icon: <IconTarget size={20} />, label: 'Campaigns' },
  { href: '/member/attendance', icon: <IconClipboard size={20} />, label: 'Attendance' },
  { href: '/member/announcements', icon: <IconMegaphone size={20} />, label: 'Announcements' },
  { href: '/member/ai', icon: <IconSparkles size={20} />, label: 'AI Help' },
  { href: '/member/profile', icon: <IconUser size={20} />, label: 'Profile' },
];

export default function MemberLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isInitialized, toasts, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isInitialized && !user) router.push('/login');
  }, [user, isInitialized, router]);

  if (!isInitialized || !user) return null;

  return (
    <div className="page-member" style={{ background: '#0A0A0E', minHeight: '100vh', color: '#FFFFFF' }}>
      {/* DEMO BANNER REMOVED */}

      {/* Top Navigation Bar */}
      <header className={`member-top-nav ${isScrolled ? 'scrolled' : ''}`}>
        <style>{`
          .member-top-nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 80px;
            z-index: 200;
            padding: 0 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: transparent;
            border-bottom: 1px solid transparent;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .member-top-nav.scrolled {
            background: rgba(12, 12, 18, 0.65);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            border-bottom: 1px solid rgba(212, 168, 67, 0.2);
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
          }

          .member-brand {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
          }

          .member-nav-links {
            display: flex;
            align-items: center;
            gap: 2px;
          }

          .member-nav-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            border-radius: 999px;
            font-size: 16px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.85);
            transition: all 0.2s ease;
            background: transparent;
            border: none;
            cursor: pointer;
            text-decoration: none;
            white-space: nowrap;
          }
          .member-nav-item:hover, .member-nav-item.active {
            color: #FFFFFF;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
          }
          .member-nav-item:hover:not(.active) {
            --glow-color: rgba(212, 168, 67, 0.2);
            border-left: 1px solid rgba(212, 168, 67, 0.2);
            border-bottom-color: rgba(212, 168, 67, 0.1);
            box-shadow: -4px 4px 12px -4px var(--glow-color);
          }
          .member-nav-item.active {
            font-weight: 700;
            --glow-color: rgba(212, 168, 67, 0.5);
            border-left: 3px solid rgba(212, 168, 67, 0.5);
            border-bottom-color: rgba(212, 168, 67, 0.25);
            animation: pulseShadow 8s infinite ease-in-out;
          }

          .member-nav-right {
            display: flex;
            align-items: center;
            gap: 10px;
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



          .mobile-toggle-btn {
            display: none;
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

          @media (max-width: 1100px) {
            .member-nav-links { display: none; }
            .user-avatar-pill .avatar-name { display: none; }
            .mobile-toggle-btn { display: flex; }
          }
        `}</style>


        {/* Brand Avatar */}
        <div className="member-brand" onClick={() => router.push('/member/dashboard')} title="View Profile">
          <div className="avatar-circle" style={{ width: 38, height: 38, fontSize: 18 }}>
            {(user?.name || 'M')[0]}
          </div>
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
          <button className="btn btn-danger btn-sm" onClick={() => { logout(); router.push('/login'); }}>
            Logout
          </button>

          <button className="btn btn-secondary btn-icon mobile-toggle-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <OnlineLogoIcon name="x" size={20} /> : <OnlineLogoIcon name="menu" size={20} />}
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
      <main style={{ paddingTop: 96, paddingBottom: 48, maxWidth: 1200, margin: '0 auto', paddingLeft: 32, paddingRight: 32 }}>
        {children}
      </main>

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(t => (
            <div key={t.id} className="toast" style={{
              borderLeft: `4px solid ${t.type === 'success' ? 'var(--emerald)' : t.type === 'error' ? 'var(--soft-red)' : 'var(--gold)'}`,
            }}>
              {t.type === 'success' ? <OnlineLogoIcon name="check-circle" size={16} color="var(--emerald)" /> : t.type === 'error' ? <OnlineLogoIcon name="x-circle" size={16} color="var(--soft-red)" /> : <OnlineLogoIcon name="info" size={16} color="var(--gold)" />} <span style={{ marginLeft: 8 }}>{t.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
