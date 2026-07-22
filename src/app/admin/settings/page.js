'use client';
import { useApp } from '@/context/app-context';

export default function SettingsPage() {
  const { theme, toggleTheme, language, setLanguage } = useApp();

  const sections = [
    {
      title: '🎨 Branding',
      items: [
        { label: 'Ministry Name', value: 'Shining Ministries', type: 'text' },
        { label: 'App Name', value: 'SM Connect', type: 'text' },
        { label: 'Scripture', value: 'Isaiah 60:1-6', type: 'text' },
      ],
    },
    {
      title: '🌍 Localization',
      items: [
        { label: 'Default Language', value: language, type: 'select', options: [
          { value: 'en', label: 'English' },
          { value: 'fr', label: 'Français' },
          { value: 'sw', label: 'Kiswahili' },
          { value: 'ky', label: 'Kinyarwanda' },
        ]},
        { label: 'Local Currency', value: 'RWF', type: 'text' },
        { label: 'Diaspora Currency', value: 'USD', type: 'text' },
      ],
    },
    {
      title: '💳 MTN MoMo',
      items: [
        { label: 'Environment', value: 'Sandbox', type: 'text' },
        { label: 'API User', value: '••••••••••', type: 'text' },
        { label: 'Subscription Key', value: '••••••••••', type: 'text' },
        { label: 'Callback URL', value: 'https://api.smconnect.org/callback', type: 'text' },
      ],
    },
    {
      title: '📧 Notifications',
      items: [
        { label: 'Email Provider', value: 'SMTP', type: 'text' },
        { label: 'Push Notifications', value: 'Enabled', type: 'text' },
        { label: 'Contribution Reminders', value: '5 days before due', type: 'text' },
      ],
    },
    {
      title: '🔐 Security',
      items: [
        { label: 'Two-Factor Auth', value: 'Enabled', type: 'text' },
        { label: 'Session Timeout', value: '30 minutes', type: 'text' },
        { label: 'IP Logging', value: 'Enabled', type: 'text' },
      ],
    },
    {
      title: '💾 Backup',
      items: [
        { label: 'Auto Backup', value: 'Daily at 02:00 AM', type: 'text' },
        { label: 'Last Backup', value: '2026-07-20 02:00 AM', type: 'text' },
        { label: 'Storage', value: 'Cloud (3 copies)', type: 'text' },
      ],
    },
  ];

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <h1>System Settings</h1>
        <p>Configure SM Connect platform settings</p>
      </div>

      {/* Theme Toggle */}
      <div className="glass-card-static animate-fade-in-up stagger-1" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
        <div className="flex-between">
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>🌙 Appearance</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Switch between light and dark mode</p>
          </div>
          <button onClick={toggleTheme} style={{
            width: 56, height: 30, borderRadius: 'var(--radius-full)', padding: 3,
            background: theme === 'dark' ? 'var(--gold)' : 'var(--gray-300)',
            transition: 'background 0.3s', cursor: 'pointer', border: 'none',
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%', background: '#fff',
              transform: theme === 'dark' ? 'translateX(26px)' : 'translateX(0)',
              transition: 'transform 0.3s var(--ease-spring)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
            }}>
              {theme === 'dark' ? '🌙' : '☀️'}
            </div>
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-2">
        {sections.map((section, i) => (
          <div key={section.title} className={`glass-card-static animate-fade-in-up stagger-${Math.min(i + 2, 6)}`} style={{ padding: 'var(--space-lg)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
              {section.title}
            </h3>
            {section.items.map(item => (
              <div key={item.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid var(--border-light)',
              }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{item.label}</span>
                {item.type === 'select' ? (
                  <select className="select" value={item.value} onChange={e => setLanguage(e.target.value)}
                    style={{ width: 'auto', padding: '4px 28px 4px 10px', fontSize: 'var(--text-sm)' }}>
                    {item.options.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : (
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{item.value}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ marginTop: 'var(--space-xl)', display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}
        className="animate-fade-in-up">
        <button className="btn btn-secondary">Export Configuration</button>
        <button className="btn btn-gold">Save Changes</button>
      </div>
    </div>
  );
}
