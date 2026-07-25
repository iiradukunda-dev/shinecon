'use client';
import { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatCurrency, formatDate } from '@/lib/demo-data';
import { OnlineLogoIcon } from '@/components/icons';

export default function ContributionsPage() {
  const { user, contributions, contributionTypes, addContribution, addToast } = useApp();
  const [view, setView] = useState('types');
  const [selectedType, setSelectedType] = useState(null);
  const [paymentStep, setPaymentStep] = useState(0);
  const [phone, setPhone] = useState('');

  const myContributions = contributions.filter(c => c.memberId === (user?.id || '1'));
  const isLocal = user?.type !== 'diaspora';
  const isStudent = user?.employment === 'student';

  const getAmount = (ct) => {
    if (isLocal) return isStudent ? ct.localStudent : ct.localEmployed;
    return isStudent ? ct.diasporaStudent : ct.diasporaEmployed;
  };
  const getCurrency = (ct) => ct.currency || 'RWF';

  const handlePay = () => {
    setPaymentStep(2);
    setTimeout(() => {
      addContribution({
        memberId: user?.id || '1',
        memberName: user?.name || 'Demo Member',
        type: selectedType.name,
        amount: getAmount(selectedType),
        currency: getCurrency(selectedType),
        phone: phone || user?.phone || '',
      });
      setPaymentStep(3);
    }, 2500);
  };

  if (selectedType && paymentStep >= 0) {
    const amount = getAmount(selectedType);
    const curr = getCurrency(selectedType);
    return (
      <div className="page-member-content">
        <button className="btn btn-ghost" onClick={() => { setSelectedType(null); setPaymentStep(0); }} style={{ marginBottom: 'var(--space-md)' }}>
          ← Back
        </button>

        <div className="glass-card-static animate-fade-in-up" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 'var(--space-md)' }}>{selectedType.icon}</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 4 }}>{selectedType.name}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-lg)' }}>
            {selectedType.description}
          </p>

          {paymentStep === 0 && (
            <>
              <div style={{
                padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)',
                background: 'rgba(212,168,67,0.08)', marginBottom: 'var(--space-lg)',
              }}>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 4 }}>Amount to Pay</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'var(--gold-dark)' }}>
                  {amount === 0 ? 'Free Amount' : formatCurrency(amount, curr)}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                  {isLocal ? 'Local' : 'Diaspora'} • {isStudent ? 'Student' : 'Employed'}
                </p>
              </div>

              <button className="btn btn-gold btn-lg" style={{ width: '100%' }} onClick={() => setPaymentStep(1)}>
                Pay with MTN MoMo →
              </button>
            </>
          )}

          {paymentStep === 1 && (
            <div className="animate-slide-up">
              <div style={{ textAlign: 'left', marginBottom: 'var(--space-lg)' }}>
                <label className="input-label">MTN MoMo Phone Number</label>
                <input className="input" placeholder="+250 78X XXX XXX" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div style={{
                padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
                background: 'rgba(43,138,62,0.08)', border: '1px solid rgba(43,138,62,0.15)',
                marginBottom: 'var(--space-lg)', textAlign: 'left', fontSize: 'var(--text-sm)',
              }}>
                <p style={{ fontWeight: 600, marginBottom: 4 }}>📱 Payment Summary</p>
                <p>{selectedType.name}: {formatCurrency(amount || 0, curr)}</p>
                <p>Method: MTN Mobile Money</p>
              </div>
              <button className="btn btn-gold btn-lg" style={{ width: '100%' }} onClick={handlePay}>
                Confirm Payment
              </button>
            </div>
          )}

          {paymentStep === 2 && (
            <div className="animate-scale-in" style={{ padding: 'var(--space-2xl)' }}>
              <div className="animate-spin" style={{
                width: 60, height: 60, border: '4px solid var(--border-light)',
                borderTopColor: 'var(--gold)', borderRadius: '50%', margin: '0 auto var(--space-lg)',
              }} />
              <p style={{ fontWeight: 600 }}>Processing Payment...</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Please confirm on your phone</p>
            </div>
          )}

          {paymentStep === 3 && (
            <div className="animate-scale-in" style={{ padding: 'var(--space-xl)' }}>
              <div style={{ fontSize: 64, marginBottom: 'var(--space-md)' }}><OnlineLogoIcon name="party-popper" size={64} color="var(--emerald)" /></div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 4 }}>Payment Submitted!</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                Pending admin approval. You&apos;ll receive a receipt once approved.
              </p>
              <button className="btn btn-gold" onClick={() => { setSelectedType(null); setPaymentStep(0); }}>
                Back to Contributions
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-member-content">
      {/* Tab Selector */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--space-lg)', background: 'var(--glass-bg)', borderRadius: 'var(--radius-full)', padding: 4 }}>
        {['types', 'history'].map(tab => (
          <button key={tab} onClick={() => setView(tab)} style={{
            flex: 1, padding: '10px 16px', borderRadius: 'var(--radius-full)',
            background: view === tab ? 'var(--gold)' : 'transparent',
            color: view === tab ? '#fff' : 'var(--text-secondary)',
            fontWeight: 600, fontSize: 'var(--text-sm)', transition: 'all 0.2s',
          }}>
            {tab === 'types' ? <><OnlineLogoIcon name="wallet" size={16} /> Contribute</> : <><OnlineLogoIcon name="history" size={16} /> History</>}
          </button>
        ))}
      </div>

      {view === 'types' && (
        <div className="flex-col gap-sm animate-fade-in">
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>
            Choose Contribution
          </h2>
          {contributionTypes.filter(ct => ct.active).map(ct => (
            <button key={ct.id} className="glass-card" style={{
              padding: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
              width: '100%', textAlign: 'left',
            }} onClick={() => { setSelectedType(ct); setPaymentStep(0); }}>
              <div style={{
                width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                background: `${ct.color}18`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 24, flexShrink: 0,
              }}><OnlineLogoIcon name={ct.icon || 'wallet'} size={24} color={ct.color} /></div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600 }}>{ct.name}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{ct.category}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, color: 'var(--gold-dark)' }}>
                  {formatCurrency(getAmount(ct), getCurrency(ct))}
                </p>
                {ct.recurring && <span className="badge badge-gold" style={{ fontSize: 9 }}>Monthly</span>}
              </div>
            </button>
          ))}
        </div>
      )}

      {view === 'history' && (
        <div className="animate-fade-in">
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
            Contribution History
          </h2>
          <div className="timeline">
            {myContributions.map(c => (
              <div key={c.id} className="timeline-item">
                <div className="glass-card-static" style={{ padding: 'var(--space-md)' }}>
                  <div className="flex-between" style={{ marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{c.type}</span>
                    <span className={`badge ${c.status === 'approved' ? 'badge-green' : c.status === 'pending' ? 'badge-amber' : 'badge-red'}`}>
                      {c.status}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)' }}>
                    {formatCurrency(c.amount, c.currency)}
                  </p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                    {formatDate(c.date)} • Ref: {c.reference}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {myContributions.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">💰</div>
              <p className="empty-state-title">No contributions yet</p>
              <p className="empty-state-description">Start contributing to support the ministry</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
