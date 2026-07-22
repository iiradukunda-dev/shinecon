'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogoClick = () => {
    if (user) {
      router.push(user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard');
    } else {
      router.push('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = login(email, password);
    setLoading(false);

    if (result.success) {
      addToast('Welcome back! God bless you.', 'success');
      router.push(result.role === 'admin' ? '/admin/dashboard' : '/member/dashboard');
    } else {
      addToast(result.error, 'error');
    }
  };

  const fillDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@smconnect.org');
      setPassword('admin123');
    } else {
      setEmail('jp.habimana@email.com');
      setPassword('demo');
    }
  };

  return (
    <div className="auth-page">
      <style>{`
        .auth-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          background: linear-gradient(135deg, #F5E6C8 0%, #E8C876 100%);
        }
        .auth-card-custom {
          width: 100%;
          max-width: 440px;
          padding: 48px 40px;
          border-radius: 32px;
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 32px 64px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8);
          color: #fff;
          overflow: hidden;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .auth-card-bg-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 320px;
          line-height: 1;
          color: rgba(0, 0, 0, 0.03);
          z-index: -1;
          pointer-events: none;
          font-family: serif;
        }
        .auth-logo-custom {
          width: 80px;
          height: 80px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-title-custom {
          text-align: center;
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .auth-subtitle-custom {
          text-align: center;
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 32px;
        }
        .auth-input-group {
          margin-bottom: 20px;
        }
        .auth-label-custom {
          display: block;
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          padding-left: 4px;
        }
        .auth-input-wrapper {
          position: relative;
        }
        .auth-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
          display: flex;
        }
        .auth-input-custom {
          width: 100%;
          padding: 14px 20px 14px 44px;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 999px;
          color: var(--text-primary);
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
        }
        .auth-input-custom::placeholder {
          color: var(--text-tertiary);
        }
        .auth-input-custom:focus {
          background: rgba(255, 255, 255, 0.8);
          border-color: var(--gold);
        }
        .auth-btn-custom {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          border: none;
          border-radius: 999px;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(212, 168, 67, 0.3);
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .auth-btn-custom:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(212, 168, 67, 0.4);
        }
        .auth-btn-custom:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .auth-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          margin-bottom: 24px;
        }
        .auth-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 14px;
          cursor: pointer;
        }
        .auth-checkbox {
          appearance: none;
          width: 16px;
          height: 16px;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.6);
          position: relative;
          cursor: pointer;
        }
        .auth-checkbox:checked {
          background: var(--gold);
          border-color: var(--gold);
        }
        .auth-checkbox:checked::after {
          content: '✓';
          position: absolute;
          color: #fff;
          font-size: 12px;
          font-weight: bold;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .auth-forgot {
          color: var(--gold-dark);
          font-size: 14px;
          text-decoration: none;
          font-weight: 600;
        }
        .auth-divider-custom {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 32px 0 24px;
          color: var(--text-tertiary);
          font-size: 13px;
        }
        .auth-divider-custom::before,
        .auth-divider-custom::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(0, 0, 0, 0.1);
        }
        .auth-demo-btn {
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(0, 0, 0, 0.1);
          color: var(--text-secondary);
          padding: 10px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .auth-demo-btn:hover {
          background: rgba(255, 255, 255, 0.8);
          border-color: rgba(0, 0, 0, 0.2);
          color: var(--text-primary);
        }
      `}</style>

      <div className="auth-bg" />
      
      <div className="auth-card-custom">
        <div className="auth-card-bg-icon">&#9833;</div>
        
        <div className="auth-logo-custom" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="SM" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        
        <h1 className="auth-title-custom">Welcome Back</h1>
        <p className="auth-subtitle-custom">Sign in to SM Connect</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label className="auth-label-custom">Email Address</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </span>
              <input
                type="email"
                className="auth-input-custom"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label-custom">Password</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="auth-input-custom"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-tertiary)',
                  cursor: 'pointer', display: 'flex', padding: 0
                }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>

            <div className="auth-options">
            <label className="auth-checkbox-label">
              <input type="checkbox" className="auth-checkbox" />
              Remember me
            </label>
            <a href="#" className="auth-forgot">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="auth-btn-custom"
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="animate-spin" style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider-custom">Demo Quick Access</div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button onClick={() => fillDemo('admin')} className="auth-demo-btn">
            Admin Demo
          </button>
          <button onClick={() => fillDemo('member')} className="auth-demo-btn">
            Member Demo
          </button>
        </div>
      </div>
    </div>
  );
}
