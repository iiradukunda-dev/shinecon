'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { useEffect, useState } from 'react';
import {
  IconChart, IconUsers, IconGive, IconTarget, IconClipboard, IconCalendar,
  IconMegaphone, IconMessage, IconFileText, IconSettings, IconShield, OnlineLogoIcon
} from '@/components/icons';
import { t } from '@/lib/i18n';

const NAV_SECTIONS = [
  { label: 'OVERVIEW', items: [
    { href: '/admin/dashboard', icon: <IconChart size={18} />, label: 'Dashboard' },
    { href: '/admin/analytics', icon: <IconShield size={18} />, label: 'Analytics' },
  ]},
  { label: 'MANAGEMENT', items: [
    { href: '/admin/members', icon: <IconUsers size={18} />, label: 'Members' },
    { href: '/admin/contributions', icon: <IconGive size={18} />, label: 'Contributions' },
    { href: '/admin/campaigns', icon: <IconTarget size={18} />, label: 'Campaigns' },
    { href: '/admin/attendance', icon: <IconClipboard size={18} />, label: 'Attendance' },
    { href: '/admin/events', icon: <IconCalendar size={18} />, label: 'Events' },
    { href: '/admin/announcements', icon: <IconMegaphone size={18} />, label: 'Announcements' },
    { href: '/admin/messages', icon: <IconMessage size={18} />, label: 'Messages' },
  ]},
  { label: 'SYSTEM', items: [
    { href: '/admin/reports', icon: <IconFileText size={18} />, label: 'Reports' },
    { href: '/admin/settings', icon: <IconSettings size={18} />, label: 'Settings' },
  ]},
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isInitialized, toasts, sidebarOpen, setSidebarOpen, logout, theme, toggleTheme, stats, messages, notifications, setNotifications, language, settings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications?.filter(n => n.unread)?.length || 0;
  const markAllRead = () => {
    if (setNotifications) {
      setNotifications(notifications.map(n => ({ ...n, unread: false })));
      fetch('/api/notifications/mark-read', { method: 'POST' }).catch(() => {});
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isInitialized && (!user || user.role !== 'admin')) router.push('/login');
  }, [user, isInitialized, router]);

  if (!isInitialized || !user || user.role !== 'admin') return null;

  const currentPage = NAV_SECTIONS.flatMap(s => s.items).find(i => i.href === pathname);

  return (
    <div className="layout-root admin-layout">

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ top: 0 }}>
        {/* Brand Avatar */}
        <div className="sidebar-brand" style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center' }}>
          <div className="avatar-circle" style={{ 
            width: 40, height: 40, fontSize: 18, 
            background: user?.photo ? `url("${user.photo}") center/cover` : 'linear-gradient(180deg, #D4A843 0%, #A37A24 100%)', 
            color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' 
          }}>
            {!user?.photo && (user?.name || 'A')[0]}
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_SECTIONS.map(section => (
            <div key={section.label}>
              <div className="sidebar-section">{t(section.label.toLowerCase().replace(' ', '_'), language)}</div>
              {section.items.map(item => {
                let badgeCount = item.badge;
                if (item.label === 'Members' && stats?.pendingMembers > 0) badgeCount = stats.pendingMembers;
                if (item.label === 'Contributions' && stats?.pendingContributions > 0) badgeCount = stats.pendingContributions;
                if (item.label === 'Messages') {
                  const unread = messages?.filter(m => m.unread).length;
                  if (unread > 0) badgeCount = unread;
                }

                return (
                <button
                  key={item.href}
                  className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
                  onClick={() => { router.push(item.href); setSidebarOpen(false); }}
                  style={{ width: '100%' }}
                >
                  <span className="link-icon">{item.icon}</span>
                  {t(item.label.toLowerCase().replace(' ', '_'), language)}
                  {badgeCount ? <span className="link-badge">{badgeCount}</span> : null}
                </button>
              )})}
            </div>
          ))}
        </nav>

        <div style={{ padding: 'var(--space-md)', borderTop: '1px solid var(--border-light)' }}>
          <button className="sidebar-link" onClick={() => { logout(); router.push('/'); }} style={{ width: '100%', color: 'var(--soft-red)' }}>
            <span className="link-icon"><OnlineLogoIcon name="log-out" /></span>
            Logout
          </button>
        </div>
      </aside>

      {/* Top Bar */}
      <header className={`topbar ${isScrolled ? 'scrolled' : ''}`} style={{ top: 0 }}>
        <div className="topbar-left">
          <button className="btn btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ display: 'none' }} id="sidebar-toggle">
            <OnlineLogoIcon name="menu" size={24} />
          </button>
          <style>{`@media (max-width: 1024px) { #sidebar-toggle { display: flex !important; } }`}</style>
          <h1 className="topbar-title">{currentPage?.label || 'Dashboard'}</h1>
        </div>
        <div className="topbar-right">
          <div className="topbar-search">
            <span><OnlineLogoIcon name="search" size={16} color="var(--text-tertiary)" /></span>
            <input placeholder={t('search', language)} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button className="btn btn-icon" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <OnlineLogoIcon name="sun" size={20} /> : <OnlineLogoIcon name="moon" size={20} />}
          </button>
          <div style={{ position: 'relative' }}>
            <button className="btn btn-icon" onClick={() => setShowNotifications(!showNotifications)}>
              <OnlineLogoIcon name="bell" size={20} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: 4, right: 4, width: 8, height: 8,
                  borderRadius: '50%', background: 'var(--soft-red)',
                }} />
              )}
            </button>
            {showNotifications && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                width: 320, background: 'var(--card-bg)', border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                zIndex: 100, overflow: 'hidden', backdropFilter: 'blur(16px)'
              }}>
                <div style={{ padding: '16px', borderBottom: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: 12, cursor: 'pointer' }}>Mark all read</button>
                  )}
                </div>
                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 14 }}>No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} style={{
                        padding: '12px 16px', borderBottom: '1px solid var(--border-light)',
                        background: n.unread ? 'rgba(212, 168, 67, 0.05)' : 'transparent',
                        display: 'flex', flexDirection: 'column', gap: 4
                      }}>
                        <span style={{ fontSize: 14, color: n.unread ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{n.message}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{n.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
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

    </div>
  );
}
