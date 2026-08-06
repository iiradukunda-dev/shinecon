'use client';
import { useState, useRef } from 'react';
import { useApp } from '@/context/app-context';
import { useRouter } from 'next/navigation';
import { getInitials, formatCurrency } from '@/lib/utils';
import { OnlineLogoIcon, IconUser } from '@/components/icons';

export default function ProfilePage() {
  const {
    user,
    updateUser,
    theme,
    toggleTheme,
    language,
    setLanguage,
    logout,
    contributions,
    addToast,
  } = useApp();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [passwordStatus, setPasswordStatus] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

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

  const myContribs = contributions.filter(
    (c) => c.memberId === (user?.id || '1') && c.status === 'approved',
  );
  const total = myContribs.reduce((s, c) => s + c.amount, 0);
  const currency = 'RWF';

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="page-member-content">
      {/* Profile Header */}
      <div
        className="glass-card-static animate-fade-in-up"
        style={{
          padding: 'var(--space-xl)',
          textAlign: 'center',
          marginBottom: 'var(--space-lg)',
        }}
      >
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: user?.photo
              ? `url("${user.photo}") center/cover`
              : 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-md)',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'var(--text-2xl)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            opacity: photoUploading ? 0.5 : 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {!user?.photo && <IconUser size={32} />}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '30%',
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              backdropFilter: 'blur(2px)',
            }}
          >
            Edit
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 2 }}>
          {user?.name || 'Jean-Pierre Habimana'}
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{user?.email}</p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-sm)',
            marginTop: 'var(--space-sm)',
          }}
        >
          <span className="badge badge-gold">
            {user?.type === 'diaspora' ? 'Diaspora' : 'Local'}
          </span>
          <span className="badge badge-blue">
            {user?.employment === 'student' ? 'Student' : 'Employed'}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        className="animate-fade-in-up"
        style={{
          display: 'flex',
          gap: 16,
          borderBottom: '1px solid var(--border-medium)',
          marginBottom: 'var(--space-xl)',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'settings', label: 'Settings' },
          { id: 'security', label: 'Security' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 16px',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: activeTab === tab.id ? 'var(--gold)' : 'var(--text-secondary)',
              borderBottom:
                activeTab === tab.id ? '2px solid var(--gold)' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 'var(--space-sm)',
              marginBottom: 'var(--space-lg)',
            }}
          >
            {[
              {
                label: 'Total Given',
                value: formatCurrency(total, currency),
                icon: <OnlineLogoIcon name="dollar-sign" size={24} />,
              },
              {
                label: 'Transactions',
                value: myContribs.length,
                icon: <OnlineLogoIcon name="bar-chart" size={24} />,
              },
              {
                label: 'Member Since',
                value: '2024',
                icon: <OnlineLogoIcon name="calendar" size={24} />,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`glass-card-static animate-fade-in-up stagger-${i + 1}`}
                style={{ padding: 'var(--space-md)', textAlign: 'center' }}
              >
                <span style={{ fontSize: 24 }}>{stat.icon}</span>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 'var(--text-lg)',
                    marginTop: 4,
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Personal Info */}
          <div
            className="glass-card-static animate-fade-in-up stagger-4"
            style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                marginBottom: 'var(--space-md)',
              }}
            >
              Personal Information
            </h3>
            {[
              { label: 'Phone', value: user?.phone || '+250 788 123 456' },
              { label: 'Country', value: user?.country || 'Rwanda' },
              {
                label: 'Status',
                value: (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <OnlineLogoIcon name="check-circle" size={16} /> Approved
                  </span>
                ),
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border-light)',
                }}
              >
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'settings' && (
        <>
          {/* Settings */}
          <div
            className="glass-card-static animate-fade-in-up stagger-5"
            style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                marginBottom: 'var(--space-md)',
              }}
            >
              Settings
            </h3>

            {/* Theme */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <OnlineLogoIcon name="moon" size={16} /> Dark Mode
              </span>
              <button
                onClick={toggleTheme}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 'var(--radius-full)',
                  padding: 3,
                  background: theme === 'dark' ? 'var(--gold)' : 'var(--gray-300)',
                  transition: 'background 0.3s',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#fff',
                    transform: theme === 'dark' ? 'translateX(22px)' : 'translateX(0)',
                    transition: 'transform 0.3s var(--ease-spring)',
                  }}
                />
              </button>
            </div>

            {/* Language */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <OnlineLogoIcon name="globe" size={16} /> Language
              </span>
              <select
                className="select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ width: 'auto', padding: '6px 32px 6px 12px', fontSize: 'var(--text-sm)' }}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="sw">Kiswahili</option>
                <option value="ky">Kinyarwanda</option>
              </select>
            </div>

            <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
              <button
                className="btn btn-ghost"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <OnlineLogoIcon name="file-text" size={16} /> Privacy Policy
              </button>
            </div>
            <div style={{ padding: '12px 0' }}>
              <button
                className="btn btn-ghost"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <OnlineLogoIcon name="clipboard" size={16} /> Terms of Service
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'security' && (
        <>
          {/* Security */}
          <div
            className="glass-card-static animate-fade-in-up stagger-5"
            style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                marginBottom: 'var(--space-md)',
              }}
            >
              Security
            </h3>

            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: 'var(--space-sm)' }}>
                <label className="input-label" style={{ fontSize: 'var(--text-xs)' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  className="input"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: 'var(--space-sm)' }}>
                <label className="input-label" style={{ fontSize: 'var(--text-xs)' }}>
                  New Password
                </label>
                <input
                  type="password"
                  required
                  className="input"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label className="input-label" style={{ fontSize: 'var(--text-xs)' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  className="input"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={passwordStatus === 'saving'}
                className="btn btn-gold"
                style={{ width: '100%' }}
              >
                {passwordStatus === 'saving' ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>

          {/* Logout */}
          <button
            className="btn btn-danger btn-lg animate-fade-in-up stagger-6"
            style={{ width: '100%' }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      )}

      <p
        style={{
          textAlign: 'center',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-tertiary)',
          marginTop: 'var(--space-lg)',
        }}
      >
        SM Connect v1.0.0 • Shining Ministries
      </p>
    </div>
  );
}
