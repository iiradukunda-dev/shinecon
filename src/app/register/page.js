'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';
import ParticlesBackground from '@/components/ParticlesBackground';

export default function RegisterPage() {
  const router = useRouter();
  const { user, addToast } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', country: 'Rwanda',
    type: 'local', employment: 'employed', password: '', confirmPassword: '',
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setShowSuccessModal(true);
      } else {
        addToast(data.error || 'Failed to register', 'error');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      addToast('Network error, please try again', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <ParticlesBackground />
      <div className="auth-card glass-heavy" style={{ borderRadius: 'var(--radius-xl)', maxWidth: 380, padding: '16px 20px' }}>
        <div className="auth-logo" onClick={() => router.push(user ? (user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard') : '/')} style={{ cursor: 'pointer', margin: '0 auto 6px', width: 48, height: 48 }}><img src="/logo.png" alt="SM" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
        <h1 className="auth-title" style={{ fontSize: '18px', marginBottom: 2 }}>Join SM Connect</h1>
        <p className="auth-subtitle" style={{ marginBottom: 10, fontSize: '12px' }}>
          {step === 1 ? 'Tell us about yourself' : 'Create your account'}
        </p>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 'var(--radius-full)',
              background: s <= step ? 'var(--gold)' : 'var(--border-medium)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="input-group">
                  <label className="input-label" style={{ fontSize: '12px', marginBottom: 2 }}>Full Name</label>
                  <input className="input" placeholder="Enter your full name" value={form.fullName} onChange={e => update('fullName', e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label" style={{ fontSize: '12px', marginBottom: 2 }}>Phone Number</label>
                  <input type="tel" className="input" placeholder="+250 788 000 000" value={form.phone} onChange={e => update('phone', e.target.value)} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                <div className="input-group">
                  <label className="input-label" style={{ fontSize: '12px', marginBottom: 2 }}>Email</label>
                  <input type="email" className="input" placeholder="your@email.com" value={form.email} onChange={e => update('email', e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label" style={{ fontSize: '12px', marginBottom: 2 }}>Country</label>
                  <select className="select" value={form.country} onChange={e => update('country', e.target.value)} style={{ padding: '8px 12px' }}>
                    <option>Rwanda</option>
                    <option>Belgium</option>
                    <option>Canada</option>
                    <option>France</option>
                    <option>Germany</option>
                    <option>UK</option>
                    <option>USA</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px', marginBottom: '12px' }}>
                <div className="input-group">
                  <label className="input-label" style={{ fontSize: '12px', marginBottom: 2 }}>Membership</label>
                  <select className="select" value={form.type} onChange={e => update('type', e.target.value)} style={{ padding: '8px 12px' }}>
                    <option value="local">Local</option>
                    <option value="diaspora">Diaspora</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label" style={{ fontSize: '12px', marginBottom: 2 }}>Status</label>
                  <select className="select" value={form.employment} onChange={e => update('employment', e.target.value)} style={{ padding: '8px 12px' }}>
                    <option value="employed">Employed</option>
                    <option value="student">Student</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button type="button" className="btn btn-gold" style={{ width: 200 }} onClick={() => setStep(2)}>
                  Continue →
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="input-group">
                  <label className="input-label" style={{ fontSize: '12px', marginBottom: 2 }}>Password</label>
                  <input type="password" className="input" placeholder="Create password" value={form.password} onChange={e => update('password', e.target.value)} required minLength={6} />
                </div>
                <div className="input-group">
                  <label className="input-label" style={{ fontSize: '12px', marginBottom: 2 }}>Confirm Password</label>
                  <input type="password" className="input" placeholder="Confirm password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.agreeTerms} onChange={e => update('agreeTerms', e.target.checked)} required style={{ accentColor: 'var(--gold)', marginTop: 3 }} />
                I agree to the Terms of Service and Privacy Policy of Shining Ministries
              </label>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: 12, marginBottom: 12 }}>
                <button type="button" className="btn btn-secondary" style={{ width: 160 }} onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button type="submit" className="btn btn-gold" style={{ width: 160 }} disabled={loading || !form.agreeTerms}>
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="animate-spin" style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                      Wait...
                    </span>
                  ) : 'Create Account'}
                </button>
              </div>

              <div style={{
                padding: '8px 12px', borderRadius: 'var(--radius-md)',
                background: 'rgba(212, 168, 67, 0.08)', border: '1px solid rgba(212, 168, 67, 0.15)',
                fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center',
              }}>
                ⏳ Account will be reviewed by an administrator before activation.
              </div>
            </>
          )}
        </form>

        <p className="auth-footer" style={{ marginTop: 16 }}>
          Already have an account? <a href="/login" style={{ color: 'var(--gold)', fontWeight: 600 }}>Sign In</a>
        </p>
      </div>

      {showSuccessModal && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal animate-scale-in" style={{ maxWidth: 400, textAlign: 'center', padding: 'var(--space-xl)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(43,138,62,0.1)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)', fontSize: 32 }}>
              ✓
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)', marginBottom: 'var(--space-sm)' }}>
              Account Created Successfully
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-lg)' }}>
              Your account has been created and is pending administrator review. You will be able to log in once your account is approved.
            </p>
            <button className="btn btn-gold" style={{ width: '100%' }} onClick={() => router.push('/login')}>
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
