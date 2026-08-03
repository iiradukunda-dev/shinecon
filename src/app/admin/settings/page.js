'use client';
import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/app-context';
import { OnlineLogoIcon } from '@/components/icons';
import { getInitials } from '@/lib/utils';

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
  const { user, updateUser, theme, toggleTheme, language, setLanguage, addToast, updateGlobalSettings } = useApp();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [passwordStatus, setPasswordStatus] = useState('');
  
  const [adminForm, setAdminForm] = useState({ fullName: '', email: '', password: '' });
  const [adminStatus, setAdminStatus] = useState('');
  const [activeTab, setActiveTab] = useState('account');

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      addToast('Image must be less than 2MB', 'error');
      return;
    }

    setPhotoUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Str = event.target.result;
      try {
        const res = await fetch('/api/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id, action: 'update_photo', photoUrl: base64Str }),
        });
        const data = await res.json();
        if (data.success) {
          updateUser({ photo: base64Str });
          addToast('Profile photo updated', 'success');
        } else {
          addToast(data.error || 'Failed to update photo', 'error');
        }
      } catch (err) {
        addToast('Network error', 'error');
      }
      setPhotoUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      addToast('New passwords do not match', 'error');
      return;
    }
    setPasswordStatus('saving');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          action: 'change_password',
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('Password changed successfully', 'success');
        setPasswordForm({ current: '', new: '', confirm: '' });
      } else {
        addToast(data.error || 'Failed to change password', 'error');
      }
    } catch (err) {
      addToast('Network error', 'error');
    }
    setPasswordStatus('');
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!adminForm.email.toLowerCase().endsWith('@gmail.com')) {
      addToast('Only official @gmail.com accounts are allowed for admin access', 'error');
      return;
    }
    
    setAdminStatus('saving');
    try {
      const res = await fetch('/api/admin/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminForm),
      });
      const data = await res.json();
      if (data.success) {
        addToast('Admin account created successfully', 'success');
        setAdminForm({ fullName: '', email: '', password: '' });
      } else {
        addToast(data.error || 'Failed to create admin account', 'error');
      }
    } catch (err) {
      addToast('Network error', 'error');
    }
    setAdminStatus('');
  };

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
        if (updateGlobalSettings) {
          updateGlobalSettings(settings);
        }
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
      title: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><OnlineLogoIcon name="palette" size={20} /> Branding</span>,
      items: [
        { label: 'Ministry Name', key: 'branding.ministryName', type: 'text' },
        { label: 'App Name', key: 'branding.appName', type: 'text' },
        { label: 'Scripture', key: 'branding.scripture', type: 'text' },
      ],
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><OnlineLogoIcon name="globe" size={20} /> Localization</span>,
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
      title: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><OnlineLogoIcon name="credit-card" size={20} /> MTN MoMo</span>,
      items: [
        { label: 'Environment', key: 'momo.environment', type: 'select', options: [{ value: 'Sandbox', label: 'Sandbox' }, { value: 'Production', label: 'Production' }] },
        { label: 'API User', key: 'momo.apiUser', type: 'password' },
        { label: 'Subscription Key', key: 'momo.subscriptionKey', type: 'password' },
        { label: 'Callback URL', key: 'momo.callbackUrl', type: 'text' },
      ],
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><OnlineLogoIcon name="mail" size={20} /> Notifications</span>,
      items: [
        { label: 'Email Provider', key: 'notifications.emailProvider', type: 'text' },
        { label: 'Push Notifications', key: 'notifications.push', type: 'select', options: [{ value: 'Enabled', label: 'Enabled' }, { value: 'Disabled', label: 'Disabled' }] },
        { label: 'Contribution Reminders', key: 'notifications.reminders', type: 'text' },
      ],
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><OnlineLogoIcon name="lock" size={20} /> Security</span>,
      items: [
        { label: 'Two-Factor Auth', key: 'security.2fa', type: 'select', options: [{ value: 'Enabled', label: 'Enabled' }, { value: 'Disabled', label: 'Disabled' }] },
        { label: 'Session Timeout', key: 'security.timeout', type: 'text' },
        { label: 'IP Logging', key: 'security.ipLogging', type: 'select', options: [{ value: 'Enabled', label: 'Enabled' }, { value: 'Disabled', label: 'Disabled' }] },
      ],
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><OnlineLogoIcon name="hard-drive" size={20} /> Backup</span>,
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

      {/* Tabs Navigation */}
      <div className="animate-fade-in-up" style={{ display: 'flex', gap: 16, borderBottom: '1px solid var(--border-medium)', marginBottom: 'var(--space-xl)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {[
          { id: 'account', label: 'My Account' },
          { id: 'system', label: 'System Admin' },
          { id: 'integrations', label: 'Integrations' },
          { id: 'advanced', label: 'Advanced Config' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none', border: 'none', padding: '12px 16px',
              fontSize: 'var(--text-sm)', fontWeight: 600,
              color: activeTab === tab.id ? 'var(--gold)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? '2px solid var(--gold)' : '2px solid transparent',
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Account */}
      {activeTab === 'account' && (
        <div className="grid grid-2" style={{ gap: 'var(--space-lg)', alignItems: 'start' }}>
          <div>
            <div className="glass-card-static animate-fade-in-up stagger-1" style={{ padding: 'var(--space-xl)', textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{
                width: 80, height: 80, borderRadius: '50%',
                background: user?.photo ? `url(${user.photo}) center/cover` : 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto var(--space-md)', color: '#fff',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-2xl)',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                opacity: photoUploading ? 0.5 : 1,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {!user?.photo && getInitials(user?.name || 'Admin')}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
                  background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, backdropFilter: 'blur(2px)'
                }}>
                  Edit
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" style={{ display: 'none' }} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 2 }}>{user?.name || 'System Admin'}</h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{user?.email}</p>
            </div>

            <div className="glass-card-static animate-fade-in-up stagger-2" style={{ padding: 'var(--space-lg)' }}>
              <div className="flex-between">
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><OnlineLogoIcon name="moon" size={20} /> Appearance</h3>
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
                    {theme === 'dark' ? <OnlineLogoIcon name="moon" size={14} color="#000" /> : <OnlineLogoIcon name="sun" size={14} color="#000" />}
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card-static animate-fade-in-up stagger-3" style={{ padding: 'var(--space-lg)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Security & Password</h3>
            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: 'var(--space-sm)' }}>
                <label className="input-label" style={{ fontSize: 'var(--text-xs)' }}>Current Password</label>
                <input type="password" required className="input" value={passwordForm.current} onChange={e => setPasswordForm({...passwordForm, current: e.target.value})} />
              </div>
              <div style={{ marginBottom: 'var(--space-sm)' }}>
                <label className="input-label" style={{ fontSize: 'var(--text-xs)' }}>New Password</label>
                <input type="password" required className="input" value={passwordForm.new} onChange={e => setPasswordForm({...passwordForm, new: e.target.value})} />
              </div>
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label className="input-label" style={{ fontSize: 'var(--text-xs)' }}>Confirm New Password</label>
                <input type="password" required className="input" value={passwordForm.confirm} onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})} />
              </div>
              <button type="submit" disabled={passwordStatus === 'saving'} className="btn btn-gold" style={{ width: '100%' }}>
                {passwordStatus === 'saving' ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab Content: System */}
      {activeTab === 'system' && (
        <div className="grid grid-2" style={{ gap: 'var(--space-lg)', alignItems: 'start' }}>
          <div className="flex-col" style={{ gap: 'var(--space-lg)' }}>
            {(user?.role === 'SUPER_ADMIN' || user?.role === 'admin' || user?.role === 'MEMBER') && (
              <div className="glass-card-static animate-fade-in-up stagger-1" style={{ padding: 'var(--space-lg)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>System Administrators</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>Create an alternative admin account.</p>
                <form onSubmit={handleCreateAdmin}>
                  <div style={{ marginBottom: 'var(--space-sm)' }}>
                    <label className="input-label" style={{ fontSize: 'var(--text-xs)' }}>Full Name</label>
                    <input type="text" required className="input" value={adminForm.fullName} onChange={e => setAdminForm({...adminForm, fullName: e.target.value})} placeholder="Jane Doe" />
                  </div>
                  <div style={{ marginBottom: 'var(--space-sm)' }}>
                    <label className="input-label" style={{ fontSize: 'var(--text-xs)' }}>Gmail Account</label>
                    <input type="email" required className="input" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} placeholder="admin@gmail.com" />
                  </div>
                  <div style={{ marginBottom: 'var(--space-md)' }}>
                    <label className="input-label" style={{ fontSize: 'var(--text-xs)' }}>Temporary Password</label>
                    <input type="password" required className="input" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} />
                  </div>
                  <button type="submit" disabled={adminStatus === 'saving'} className="btn btn-gold" style={{ width: '100%' }}>
                    {adminStatus === 'saving' ? 'Creating...' : 'Create Admin'}
                  </button>
                </form>
              </div>
            )}
          </div>
          
          <div className="flex-col" style={{ gap: 'var(--space-lg)' }}>
            {[sections[0], sections[1]].map((section, i) => (
              <div key={i} className={`glass-card-static animate-fade-in-up stagger-${i + 2}`} style={{ padding: 'var(--space-lg)' }}>
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
        </div>
      )}

      {/* Tab Content: Integrations */}
      {activeTab === 'integrations' && (
        <div className="grid grid-2" style={{ gap: 'var(--space-lg)', alignItems: 'start' }}>
          {[sections[2], sections[3]].map((section, i) => (
            <div key={i} className={`glass-card-static animate-fade-in-up stagger-${i + 1}`} style={{ padding: 'var(--space-lg)' }}>
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
      )}

      {/* Tab Content: Advanced */}
      {activeTab === 'advanced' && (
        <div className="grid grid-2" style={{ gap: 'var(--space-lg)', alignItems: 'start' }}>
          {[sections[4], sections[5]].map((section, i) => (
            <div key={i} className={`glass-card-static animate-fade-in-up stagger-${i + 1}`} style={{ padding: 'var(--space-lg)' }}>
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
      )}

      {/* Actions */}
      <div style={{ marginTop: 'var(--space-xl)', display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-lg)' }}

        className="animate-fade-in-up">
        <button className="btn btn-secondary">Export Configuration</button>
        <button className="btn btn-gold" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
