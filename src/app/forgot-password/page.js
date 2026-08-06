'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';
import ParticlesBackground from '@/components/ParticlesBackground';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { addToast } = useApp();

  // Steps: 1 = Email, 2 = Code, 3 = New Password
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [testUrl, setTestUrl] = useState(null);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email) return addToast('Email is required', 'error');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        addToast(data.message, 'success');
        if (data.testUrl) {
          setTestUrl(data.testUrl);
        }
        setStep(2);
      } else {
        addToast(data.error || 'Failed to request reset code', 'error');
      }
    } catch (error) {
      console.error(error);
      addToast('Network error, please try again', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (code.length !== 6) return addToast('Code must be 6 digits', 'error');
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return addToast('Passwords do not match', 'error');
    if (newPassword.length < 6) return addToast('Password must be at least 6 characters', 'error');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        addToast('Password reset successful! Please log in.', 'success');
        router.push('/login');
      } else {
        addToast(data.error || 'Failed to reset password', 'error');
        // If code is invalid/expired, send them back to step 2
        if (data.error?.toLowerCase().includes('code')) {
          setStep(2);
        }
      }
    } catch (error) {
      console.error(error);
      addToast('Network error, please try again', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <style>{`
        .auth-logo, .auth-title, .auth-subtitle {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .auth-logo { animation-delay: 0.1s; }
        .auth-title { animation-delay: 0.2s; }
        .auth-subtitle { animation-delay: 0.3s; }

        .auth-form > * {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .auth-form > *:nth-child(1) { animation-delay: 0.4s; }
        .auth-form > *:nth-child(2) { animation-delay: 0.5s; }
        .auth-form > *:nth-child(3) { animation-delay: 0.6s; }

        .auth-login-link {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.7s;
        }

        .auth-input-wrapper { position: relative; margin-bottom: 16px; }
        .auth-input-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: var(--gold); display: flex; opacity: 0.85;
        }
        .auth-input-custom {
          width: 100%; padding: 10px 16px 10px 40px;
          background: rgba(255, 255, 255, 0.07); border: 1px solid var(--border-light);
          border-radius: 999px; color: #FFFFFF; font-size: 15px; outline: none;
          transition: all 0.2s; backdrop-filter: blur(10px);
        }
        .auth-input-custom::placeholder { color: rgba(255, 255, 255, 0.25); font-size: 13px; }
        .auth-input-custom:focus {
          background: rgba(255, 255, 255, 0.12); border-color: var(--gold);
          box-shadow: none;
        }
      `}</style>
      <ParticlesBackground />

      <div
        className="auth-card glass-heavy"
        style={{
          borderRadius: 'var(--radius-xl)',
          maxWidth: 360,
          padding: '24px 20px',
          animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="auth-logo"
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer', margin: '0 auto 12px', width: 48, height: 48 }}
        >
          <img
            src="/logo.png"
            alt="SM"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        <h1 className="auth-title" style={{ fontSize: '20px', marginBottom: 4 }}>
          Reset Password
        </h1>
        <p className="auth-subtitle" style={{ marginBottom: 20, fontSize: '13px', opacity: 0.8 }}>
          {step === 1 && 'Enter your email to receive a code'}
          {step === 2 && 'Enter the 6-digit code sent to your email'}
          {step === 3 && 'Create a new secure password'}
        </p>

        <form
          className="auth-form"
          onSubmit={
            step === 1 ? handleRequestCode : step === 2 ? handleVerifyCode : handleResetPassword
          }
        >
          {step === 1 && (
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <input
                type="email"
                className="auth-input-custom"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          {step === 2 && (
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                type="text"
                className="auth-input-custom"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                required
              />
            </div>
          )}

          {step === 3 && (
            <>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input-custom"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-tertiary)',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: 0,
                  }}
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input-custom"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 24 }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                borderRadius: '999px',
                height: '42px',
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}
            >
              {loading ? (
                <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
              ) : step === 1 ? (
                'Send Code'
              ) : step === 2 ? (
                'Verify Code'
              ) : (
                'Reset Password'
              )}
            </button>
          </div>
        </form>

        <div className="auth-login-link" style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Remember your password?{' '}
          </span>
          <span
            onClick={() => router.push('/login')}
            style={{ color: 'var(--gold)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
          >
            Log in
          </span>
        </div>

        {testUrl && (
          <div
            style={{
              marginTop: 24,
              padding: 12,
              borderRadius: 8,
              background: 'rgba(212, 168, 67, 0.1)',
              border: '1px solid rgba(212, 168, 67, 0.3)',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: 'rgba(255, 255, 255, 0.7)',
                display: 'block',
                marginBottom: 4,
              }}
            >
              🛠️ <b>Development Mode</b>
            </span>
            <a
              href={testUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 13,
                color: 'var(--gold)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Click here to view the test email
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
