'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { useEffect } from 'react';

const NAV_ITEMS = [
  { href: '/member/dashboard', icon: '🏠', label: 'Home' },
  { href: '/member/contributions', icon: '💰', label: 'Give' },
  { href: '/member/campaigns', icon: '🎯', label: 'Campaigns' },
  { href: '/member/attendance', icon: '📋', label: 'Attendance' },
  { href: '/member/profile', icon: '👤', label: 'Profile' },
];

export default function MemberLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, toasts, logout } = useApp();

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="page-member">
      {/* Demo Banner */}
      <div className="demo-banner">✦ DEMO MODE — SM Connect ✦</div>

      {/* Top bar for member */}
      <header style={{
        position: 'sticky', top: 28, zIndex: 100,
        padding: '12px var(--space-lg)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--glass-bg-heavy)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div onClick={() => router.push('/member/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', cursor: 'pointer' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 'var(--radius-sm)',
            overflow: 'hidden', flexShrink: 0,
          }}><img src="/logo.png" alt="SM" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)' }}>
            SM Connect
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <button className="btn btn-ghost" onClick={() => router.push('/member/ai')} style={{ fontSize: 20 }}>✨</button>
          <button className="btn btn-ghost" onClick={() => router.push('/member/announcements')} style={{ fontSize: 20 }}>📢</button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ paddingTop: 'var(--space-md)' }}>
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav" style={{ bottom: 0 }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.href}
            className={`bottom-nav-item ${pathname === item.href ? 'active' : ''}`}
            onClick={() => router.push(item.href)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Floating AI Button */}
      <button className="fab-ai" onClick={() => router.push('/member/ai')} title="AI Assistant">
        ✨
      </button>

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
