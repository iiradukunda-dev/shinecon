'use client';
import { useApp } from '@/context/app-context';
import { useRouter } from 'next/navigation';
import { getInitials, formatCurrency } from '@/lib/utils';
import { OnlineLogoIcon } from '@/components/icons';

export default function ProfilePage() {
  const { user, theme, toggleTheme, language, setLanguage, logout, contributions } = useApp();
  const router = useRouter();

  const myContribs = contributions.filter(c => c.memberId === (user?.id || '1') && c.status === 'approved');
  const total = myContribs.reduce((s, c) => s + c.amount, 0);
  const currency = 'RWF';

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="page-member-content">
      {/* Profile Header */}
      <div className="glass-card-static animate-fade-in-up" style={{
        padding: 'var(--space-xl)', textAlign: 'center', marginBottom: 'var(--space-lg)',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto var(--space-md)', color: '#fff',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-2xl)',
        }}>
          {getInitials(user?.name || 'JP')}
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 2 }}>
          {user?.name || 'Jean-Pierre Habimana'}
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{user?.email}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
          <span className="badge badge-gold">{user?.type === 'diaspora' ? 'Diaspora' : 'Local'}</span>
          <span className="badge badge-blue">{user?.employment === 'student' ? 'Student' : 'Employed'}</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
        {[
          { label: 'Total Given', value: formatCurrency(total, currency), icon: <OnlineLogoIcon name="dollar-sign" size={24} /> },
          { label: 'Transactions', value: myContribs.length, icon: <OnlineLogoIcon name="bar-chart" size={24} /> },
          { label: 'Member Since', value: '2024', icon: <OnlineLogoIcon name="calendar" size={24} /> },
        ].map((stat, i) => (
          <div key={i} className={`glass-card-static animate-fade-in-up stagger-${i + 1}`} style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
            <span style={{ fontSize: 24 }}>{stat.icon}</span>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', marginTop: 4 }}>
              {stat.value}
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Personal Info */}
      <div className="glass-card-static animate-fade-in-up stagger-4" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Personal Information</h3>
        {[
          { label: 'Phone', value: user?.phone || '+250 788 123 456' },
          { label: 'Country', value: user?.country || 'Rwanda' },
          { label: 'Status', value: <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><OnlineLogoIcon name="check-circle" size={16} /> Approved</span> },
        ].map(item => (
          <div key={item.label} style={{
            display: 'flex', justifyContent: 'space-between', padding: '12px 0',
            borderBottom: '1px solid var(--border-light)',
          }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{item.label}</span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="glass-card-static animate-fade-in-up stagger-5" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Settings</h3>

        {/* Theme */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 8 }}><OnlineLogoIcon name="moon" size={16} /> Dark Mode</span>
          <button onClick={toggleTheme} style={{
            width: 48, height: 26, borderRadius: 'var(--radius-full)', padding: 3,
            background: theme === 'dark' ? 'var(--gold)' : 'var(--gray-300)',
            transition: 'background 0.3s', cursor: 'pointer', border: 'none',
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: '#fff',
              transform: theme === 'dark' ? 'translateX(22px)' : 'translateX(0)',
              transition: 'transform 0.3s var(--ease-spring)',
            }} />
          </button>
        </div>

        {/* Language */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 8 }}><OnlineLogoIcon name="globe" size={16} /> Language</span>
          <select className="select" value={language} onChange={e => setLanguage(e.target.value)}
            style={{ width: 'auto', padding: '6px 32px 6px 12px', fontSize: 'var(--text-sm)' }}>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="sw">Kiswahili</option>
            <option value="ky">Kinyarwanda</option>
          </select>
        </div>

        <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
          <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <OnlineLogoIcon name="file-text" size={16} /> Privacy Policy
          </button>
        </div>
        <div style={{ padding: '12px 0' }}>
          <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <OnlineLogoIcon name="clipboard" size={16} /> Terms of Service
          </button>
        </div>
      </div>

      {/* Logout */}
      <button className="btn btn-danger btn-lg animate-fade-in-up stagger-6" style={{ width: '100%' }} onClick={handleLogout}>
        Logout
      </button>

      <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-lg)' }}>
        SM Connect v1.0.0 • Shining Ministries
      </p>
    </div>
  );
}
