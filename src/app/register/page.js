'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';

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
        addToast(data.message || 'Registration submitted! Pending admin approval.', 'success');
        router.push('/login');
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
      <div className="auth-bg" />
      <div className="auth-card glass-heavy" style={{ borderRadius: 'var(--radius-2xl)', maxWidth: 480 }}>
        <div className="auth-logo" onClick={() => router.push(user ? (user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard') : '/')} style={{ cursor: 'pointer' }}><img src="/logo.png" alt="SM" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
        <h1 className="auth-title">Join SM Connect</h1>
        <p className="auth-subtitle">
          {step === 1 ? 'Tell us about yourself' : 'Create your account'}
        </p>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-xl)' }}>
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
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input className="input" placeholder="Enter your full name" value={form.fullName} onChange={e => update('fullName', e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input type="email" className="input" placeholder="your@email.com" value={form.email} onChange={e => update('email', e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input type="tel" className="input" placeholder="+250 788 000 000" value={form.phone} onChange={e => update('phone', e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">Country</label>
                <select className="select" value={form.country} onChange={e => update('country', e.target.value)}>
                  <option>Rwanda</option>
                  <option>Belgium</option>
                  <option>Canada</option>
                  <option>France</option>
                  <option>Germany</option>
                  <option>United Kingdom</option>
                  <option>United States</option>
                  <option>Other</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                <div className="input-group">
                  <label className="input-label">Membership</label>
                  <select className="select" value={form.type} onChange={e => update('type', e.target.value)}>
                    <option value="local">Local</option>
                    <option value="diaspora">Diaspora</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Status</label>
                  <select className="select" value={form.employment} onChange={e => update('employment', e.target.value)}>
                    <option value="employed">Employed</option>
                    <option value="student">Student</option>
                  </select>
                </div>
              </div>
              <button type="button" className="btn btn-gold btn-lg" style={{ width: '100%' }} onClick={() => setStep(2)}>
                Continue →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="input-group">
                <label className="input-label">Password</label>
                <input type="password" className="input" placeholder="Create a strong password" value={form.password} onChange={e => update('password', e.target.value)} required minLength={6} />
              </div>
              <div className="input-group">
                <label className="input-label">Confirm Password</label>
                <input type="password" className="input" placeholder="Confirm your password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required />
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.agreeTerms} onChange={e => update('agreeTerms', e.target.checked)} required style={{ accentColor: 'var(--gold)', marginTop: 3 }} />
                I agree to the Terms of Service and Privacy Policy of Shining Ministries
              </label>

              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <button type="button" className="btn btn-secondary btn-lg" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button type="submit" className="btn btn-gold btn-lg" style={{ flex: 1 }} disabled={loading || !form.agreeTerms}>
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="animate-spin" style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                      Submitting...
                    </span>
                  ) : 'Create Account'}
                </button>
              </div>

              <div style={{
                padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
                background: 'rgba(212, 168, 67, 0.08)', border: '1px solid rgba(212, 168, 67, 0.15)',
                fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textAlign: 'center',
              }}>
                ⏳ After registration, your account will be reviewed by an administrator before activation.
              </div>
            </>
          )}
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}
