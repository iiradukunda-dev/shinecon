'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { useEffect, useState } from 'react';
import {
  IconChart, IconUsers, IconGive, IconTarget, IconClipboard, IconCalendar,
  IconMegaphone, IconMessage, IconFileText, IconSettings, IconShield
} from '@/components/icons';

const NAV_SECTIONS = [
  { label: 'OVERVIEW', items: [
    { href: '/admin/dashboard', icon: <IconChart size={18} />, label: 'Dashboard' },
    { href: '/admin/analytics', icon: <IconShield size={18} />, label: 'Analytics' },
  ]},
  { label: 'MANAGEMENT', items: [
    { href: '/admin/members', icon: <IconUsers size={18} />, label: 'Members', badge: 2 },
    { href: '/admin/contributions', icon: <IconGive size={18} />, label: 'Contributions', badge: 3 },
    { href: '/admin/campaigns', icon: <IconTarget size={18} />, label: 'Campaigns' },
    { href: '/admin/attendance', icon: <IconClipboard size={18} />, label: 'Attendance' },
    { href: '/admin/events', icon: <IconCalendar size={18} />, label: 'Events' },
    { href: '/admin/announcements', icon: <IconMegaphone size={18} />, label: 'Announcements' },
    { href: '/admin/messages', icon: <IconMessage size={18} />, label: 'Messages', badge: 2 },
  ]},
  { label: 'SYSTEM', items: [
    { href: '/admin/reports', icon: <IconFileText size={18} />, label: 'Reports' },
    { href: '/admin/settings', icon: <IconSettings size={18} />, label: 'Settings' },
  ]},
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, toasts, sidebarOpen, setSidebarOpen, logout, theme, toggleTheme } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') router.push('/login');
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  const currentPage = NAV_SECTIONS.flatMap(s => s.items).find(i => i.href === pathname);

  return (
    <div>
      {/* Demo Banner */}
      <div className="demo-banner">✦ DEMO MODE — SM Connect Admin ✦</div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ top: 28 }}>
        <div className="sidebar-brand" onClick={() => router.push('/admin/dashboard')} style={{ cursor: 'pointer' }}>
          <div className="sidebar-brand-logo"><img src="/logo.png" alt="SM" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
          <div>
            <div className="sidebar-brand-text">SM Connect</div>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>Admin Portal</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_SECTIONS.map(section => (
            <div key={section.label}>
              <div className="sidebar-section">{section.label}</div>
              {section.items.map(item => (
                <button
                  key={item.href}
                  className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
                  onClick={() => { router.push(item.href); setSidebarOpen(false); }}
                  style={{ width: '100%' }}
                >
                  <span className="link-icon">{item.icon}</span>
                  {item.label}
                  {item.badge && <span className="link-badge">{item.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: 'var(--space-md)', borderTop: '1px solid var(--border-light)' }}>
          <button className="sidebar-link" onClick={() => { logout(); router.push('/'); }} style={{ width: '100%', color: 'var(--soft-red)' }}>
            <span className="link-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Top Bar */}
      <header className="topbar" style={{ top: 28 }}>
        <div className="topbar-left">
          <button className="btn btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ display: 'none' }} id="sidebar-toggle">
            ☰
          </button>
          <style>{`@media (max-width: 1024px) { #sidebar-toggle { display: flex !important; } }`}</style>
          <h1 className="topbar-title">{currentPage?.label || 'Dashboard'}</h1>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <span>🔍</span>
            <input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button className="btn btn-icon" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="btn btn-icon" style={{ position: 'relative' }}>
            🔔
            <span style={{
              position: 'absolute', top: 4, right: 4, width: 8, height: 8,
              borderRadius: '50%', background: 'var(--soft-red)',
            }} />
          </button>
          <div className="topbar-avatar">SA</div>
        </div>
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          zIndex: 'var(--z-sticky)', display: 'none',
        }} id="sidebar-overlay" />
      )}
      <style>{`@media (max-width: 1024px) { #sidebar-overlay { display: block !important; } }`}</style>

      {/* Main Content */}
      <main className="page-admin" style={{ paddingTop: `calc(var(--topbar-height) + 28px)` }}>
        <div className="page-admin-content">
          {children}
        </div>
      </main>

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(t => (
            <div key={t.id} className="toast" style={{
              borderLeft: `4px solid ${t.type === 'success' ? 'var(--emerald)' : t.type === 'error' ? 'var(--soft-red)' : t.type === 'warning' ? 'var(--amber)' : 'var(--gold)'}`,
            }}>
              {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warning' ? '⚠️' : 'ℹ️'} {t.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
