'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { OnlineLogoIcon } from '@/components/icons';
import ParticlesBackground from '@/components/ParticlesBackground';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(false);

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
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      addToast('Welcome back! God bless you.', 'success');
      router.push(result.role === 'admin' ? '/admin/dashboard' : '/member/dashboard');
    } else {
      if (result.error === 'Account is pending approval or suspended') {
        setShowReviewModal(true);
      } else {
        if (result.error === 'Incorrect password') {
          setIncorrectPassword(true);
        }
        addToast(result.error, 'error');
      }
    }
  };


  return (
    <div className="auth-page">
      <style>{`

        .auth-card-custom {
          width: 100%;
          max-width: 380px;
          padding: 16px 20px;
          border-radius: 20px;
          position: relative;
          z-index: 1;
          background: rgba(15, 15, 20, 0.75);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          
          /* Refractive border gradient for 3D liquid glass effect */
          border: 1px solid transparent;
          background-image: 
            linear-gradient(rgba(15, 15, 20, 0.75), rgba(15, 15, 20, 0.75)), 
            linear-gradient(135deg, rgba(212, 168, 67, 0.7) 0%, rgba(255, 255, 255, 0.15) 30%, rgba(255, 255, 255, 0.05) 70%, rgba(212, 168, 67, 0.7) 100%);
          background-origin: border-box;
          background-clip: padding-box, border-box;

          box-shadow: 
            0 32px 64px rgba(0, 0, 0, 0.8), 
            inset 0 0 24px rgba(212, 168, 67, 0.06),
            inset 0 1px 1px rgba(255, 255, 255, 0.25);
          color: #fff;
          overflow: hidden;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .auth-card-bg-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 240px;
          line-height: 1;
          color: rgba(212, 168, 67, 0.04);
          z-index: -1;
          pointer-events: none;
          font-family: serif;
        }
        .auth-logo-custom {
          width: 48px;
          height: 48px;
          margin: 0 auto 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 0 12px rgba(212, 168, 67, 0.4));
        }
        .auth-title-custom {
          text-align: center;
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          color: var(--gold);
          margin-bottom: 2px;
        }
        .auth-subtitle-custom {
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          margin-bottom: 12px;
        }
        .auth-input-group {
          margin-bottom: 12px;
        }
        .auth-label-custom {
          display: block;
          color: rgba(255, 255, 255, 0.9);
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 4px;
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
          color: var(--gold);
          display: flex;
          opacity: 0.85;
        }
        .auth-input-custom {
          width: 100%;
          padding: 10px 16px 10px 40px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(212, 168, 67, 0.3);
          border-radius: 999px;
          color: #FFFFFF;
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        }
        .auth-input-custom::placeholder {
          color: rgba(255, 255, 255, 0.25);
          font-size: 13px;
        }
        .auth-input-custom:focus {
          background: rgba(255, 255, 255, 0.12);
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(212, 168, 67, 0.25);
        }

        .auth-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 6px;
          margin-bottom: 12px;
        }
        .auth-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 13px;
          cursor: pointer;
        }
        .auth-checkbox {
          appearance: none;
          width: 14px;
          height: 14px;
          border: 1px solid rgba(212, 168, 67, 0.4);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
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
          font-size: 10px;
          font-weight: bold;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .auth-forgot {
          color: var(--gold-light);
          font-size: 13px;
          text-decoration: none;
          font-weight: 600;
        }
        .auth-forgot:hover {
          text-decoration: underline;
        }

        .auth-signup-container {
          margin-top: 12px;
          text-align: center;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.75);
          padding-top: 12px;
          border-top: 1px solid rgba(212, 168, 67, 0.2);
        }
      `}</style>
      
      <ParticlesBackground />

      <div className="auth-card-custom">

        
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  setIncorrectPassword(false);
                }}
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

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 12 }}>
            <button
              type="submit"
              className="btn btn-gold"
              style={{ width: 200 }}
              disabled={loading || incorrectPassword}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="animate-spin" style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </div>
        </form>


        <div className="auth-signup-container">
          Don&apos;t have an account?
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 6 }} onClick={() => router.push('/register')}>
            Sign Up
          </button>
        </div>
      </div>

      {showReviewModal && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal animate-scale-in" style={{ maxWidth: 400, textAlign: 'center', padding: 'var(--space-xl)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(212,168,67,0.1)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)', fontSize: 32 }}>
              ⏳
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)', marginBottom: 'var(--space-sm)' }}>
              Account Under Review
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-lg)' }}>
              Your account is still pending administrator approval. Please wait until your account is reviewed to sign in.
            </p>
            <button className="btn btn-gold" style={{ width: '100%' }} onClick={() => setShowReviewModal(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
