'use client';
import { useState, useEffect } from 'react';
import { useApp } from '@/context/app-context';

const DEFAULT_SETTINGS = {
  'branding.ministryName': 'Shining Ministries',
  'branding.appName': 'SM Connect',
  'branding.scripture': 'Isaiah 60:1-6',
  'localization.defaultLanguage': 'en',
  'localization.localCurrency': 'RWF',
  'momo.environment': 'Sandbox',
  'momo.apiUser': '',
  'momo.subscriptionKey': '',
  'momo.callbackUrl': 'https://api.smconnect.org/callback',
  'notifications.emailProvider': 'SMTP',
  'notifications.push': 'Enabled',
  'notifications.reminders': '5 days before due',
  'security.2fa': 'Enabled',
  'security.timeout': '30 minutes',
  'security.ipLogging': 'Enabled',
  'backup.auto': 'Daily at 02:00 AM',
  'backup.last': '2026-07-20 02:00 AM',
  'backup.storage': 'Cloud (3 copies)',
};

export default function SettingsPage() {
  const { theme, toggleTheme, language, setLanguage, addToast } = useApp();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings?_t=' + Date.now(), { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (!data.error && Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'localization.defaultLanguage') {
      setLanguage(value);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        addToast('Settings saved successfully', 'success');
      } else {
        addToast('Failed to save settings', 'error');
      }
    } catch (err) {
      addToast('An error occurred while saving', 'error');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    {
      title: '🎨 Branding',
      items: [
        { label: 'Ministry Name', key: 'branding.ministryName', type: 'text' },
        { label: 'App Name', key: 'branding.appName', type: 'text' },
        { label: 'Scripture', key: 'branding.scripture', type: 'text' },
      ],
    },
    {
      title: '🌍 Localization',
      items: [
        { label: 'Default Language', key: 'localization.defaultLanguage', type: 'select', options: [
          { value: 'en', label: 'English' },
          { value: 'fr', label: 'Français' },
          { value: 'sw', label: 'Kiswahili' },
          { value: 'ky', label: 'Kinyarwanda' },
        ]},
        { label: 'Local Currency', key: 'localization.localCurrency', type: 'text' },
      ],
    },
    {
      title: '💳 MTN MoMo',
      items: [
        { label: 'Environment', key: 'momo.environment', type: 'select', options: [{ value: 'Sandbox', label: 'Sandbox' }, { value: 'Production', label: 'Production' }] },
        { label: 'API User', key: 'momo.apiUser', type: 'password' },
        { label: 'Subscription Key', key: 'momo.subscriptionKey', type: 'password' },
        { label: 'Callback URL', key: 'momo.callbackUrl', type: 'text' },
      ],
    },
    {
      title: '📧 Notifications',
      items: [
        { label: 'Email Provider', key: 'notifications.emailProvider', type: 'text' },
        { label: 'Push Notifications', key: 'notifications.push', type: 'select', options: [{ value: 'Enabled', label: 'Enabled' }, { value: 'Disabled', label: 'Disabled' }] },
        { label: 'Contribution Reminders', key: 'notifications.reminders', type: 'text' },
      ],
    },
    {
      title: '🔐 Security',
      items: [
        { label: 'Two-Factor Auth', key: 'security.2fa', type: 'select', options: [{ value: 'Enabled', label: 'Enabled' }, { value: 'Disabled', label: 'Disabled' }] },
        { label: 'Session Timeout', key: 'security.timeout', type: 'text' },
        { label: 'IP Logging', key: 'security.ipLogging', type: 'select', options: [{ value: 'Enabled', label: 'Enabled' }, { value: 'Disabled', label: 'Disabled' }] },
      ],
    },
    {
      title: '💾 Backup',
      items: [
        { label: 'Auto Backup', key: 'backup.auto', type: 'text' },
        { label: 'Last Backup', key: 'backup.last', type: 'text', readOnly: true },
        { label: 'Storage', key: 'backup.storage', type: 'text' },
      ],
    },
  ];

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading settings...</div>;
  }

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
                padding: '10px 0', borderBottom: '1px solid var(--border-light)', gap: 16
              }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', flexShrink: 0 }}>{item.label}</span>
                {item.type === 'select' ? (
                  <select 
                    className="select" 
                    value={settings[item.key] || ''} 
                    onChange={e => handleChange(item.key, e.target.value)}
                    style={{ flex: 1, maxWidth: 200, padding: '4px 28px 4px 10px', fontSize: 'var(--text-sm)' }}
                  >
                    {item.options.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type={item.type}
                    className="input"
                    value={settings[item.key] || ''}
                    readOnly={item.readOnly}
                    onChange={e => handleChange(item.key, e.target.value)}
                    style={{ flex: 1, maxWidth: 200, fontSize: 'var(--text-sm)' }}
                  />
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
        <button className="btn btn-gold" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
