'use client';
import { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatCurrency, formatDate } from '@/lib/utils';
import { OnlineLogoIcon } from '@/components/icons';

export default function ContributionsPage() {
  const { user, contributions, contributionTypes, campaigns, addContribution, addToast } = useApp();
  const [view, setView] = useState('types');
  const [selectedType, setSelectedType] = useState(null);
  const [paymentStep, setPaymentStep] = useState(0);
  const [phone, setPhone] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const myContributions = contributions.filter((c) => c.memberId === (user?.id || '1'));
  const isLocal = user?.type !== 'diaspora';
  const isStudent = user?.employment === 'student';

  const getAmount = (ct) => {
    if (ct.isCampaign || (!ct.localStudent && ct.localStudent !== 0)) return 0;
    if (isLocal) return isStudent ? ct.localStudent : ct.localEmployed;
    return isStudent ? ct.diasporaStudent : ct.diasporaEmployed;
  };
  const getCurrency = (ct) => ct.currency || 'RWF';

  const allOptions = [
    ...contributionTypes.filter((ct) => ct.active).map((ct) => ({ ...ct, isCampaign: false })),
    ...(campaigns || [])
      .filter((c) => c.status === 'active')
      .map((c) => ({
        id: c.id,
        name: c.title,
        description: c.description,
        category: 'Campaign',
        icon: c.image || 'target',
        currency: c.currency || 'RWF',
        recurring: false,
        isCampaign: true,
      })),
  ];

  const handlePay = async () => {
    if (getAmount(selectedType) === 0 && (!customAmount || Number(customAmount) <= 0)) {
      addToast('Please enter a valid amount', 'error');
      return;
    }
    if (!phone && !user?.phone) {
      addToast('Please enter your MTN MoMo phone number', 'error');
      return;
    }

    setPaymentStep(2);

    try {
      const amount = getAmount(selectedType) === 0 ? Number(customAmount) : getAmount(selectedType);

      const res = await fetch('/api/momo/requesttopay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          phone: phone || user?.phone,
          reference: `contrib-${Date.now()}`,
        }),
      });

      const data = await res.json();

      if (data.success) {
        addContribution({
          memberId: user?.id || '1',
          memberName: user?.name || 'Unknown Member',
          type: selectedType.name,
          amount: amount,
          currency: getCurrency(selectedType),
          phone: phone || user?.phone || '',
        });
        addToast('USSD push sent! Please check your phone to confirm.', 'success');
        setPaymentStep(3);
      } else {
        addToast(data.error || 'Failed to initiate payment', 'error');
        setPaymentStep(1);
      }
    } catch (err) {
      addToast('Network error, please try again later.', 'error');
      setPaymentStep(1);
    }
  };

  if (selectedType && paymentStep >= 0) {
    const amount = getAmount(selectedType);
    const curr = getCurrency(selectedType);
    return (
      <div className="page-member-content">
        <button
          className="btn btn-ghost"
          onClick={() => {
            setSelectedType(null);
            setPaymentStep(0);
          }}
          style={{ marginBottom: 'var(--space-md)' }}
        >
          ← Back
        </button>

        <div
          className="glass-card-static animate-fade-in-up"
          style={{ padding: 'var(--space-xl)', textAlign: 'center' }}
        >
          <span
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-md)' }}
          >
            <OnlineLogoIcon name={selectedType.icon || 'wallet'} size={48} />
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 4 }}>
            {selectedType.name}
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-lg)',
            }}
          >
            {selectedType.description}
          </p>

          {paymentStep === 0 && (
            <>
              <div
                style={{
                  padding: 'var(--space-lg)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(212,168,67,0.08)',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                <p
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-tertiary)',
                    marginBottom: 4,
                  }}
                >
                  Amount to Pay
                </p>
                {amount === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <input
                      type="number"
                      className="input"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      style={{
                        fontSize: 'var(--text-3xl)',
                        fontWeight: 800,
                        color: 'var(--gold-dark)',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '2px solid var(--gold)',
                        borderRadius: 0,
                        padding: '0 0 4px 0',
                        width: 200,
                      }}
                    />
                    <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{curr}</span>
                  </div>
                ) : (
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--text-4xl)',
                      fontWeight: 800,
                      color: 'var(--gold-dark)',
                    }}
                  >
                    {formatCurrency(amount, curr)}
                  </p>
                )}
                <p
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-tertiary)',
                    marginTop: 4,
                  }}
                >
                  {isLocal ? 'Local' : 'Diaspora'} • {isStudent ? 'Student' : 'Employed'}
                </p>
              </div>

              <button
                className="btn btn-gold btn-lg"
                style={{ width: '100%' }}
                onClick={() => setPaymentStep(1)}
                disabled={amount === 0 && (!customAmount || Number(customAmount) <= 0)}
              >
                Pay with MTN MoMo →
              </button>
            </>
          )}

          {paymentStep === 1 && (
            <div className="animate-slide-up">
              <div style={{ textAlign: 'left', marginBottom: 'var(--space-lg)' }}>
                <label className="input-label">MTN MoMo Phone Number</label>
                <input
                  className="input"
                  placeholder="+250 78X XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div
                style={{
                  padding: 'var(--space-md)',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(43,138,62,0.08)',
                  border: '1px solid rgba(43,138,62,0.15)',
                  marginBottom: 'var(--space-lg)',
                  textAlign: 'left',
                  fontSize: 'var(--text-sm)',
                }}
              >
                <p
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  <OnlineLogoIcon name="smartphone" size={16} /> Payment Summary
                </p>
                <p>
                  {selectedType.name}:{' '}
                  {formatCurrency(amount === 0 ? Number(customAmount) : amount, curr)}
                </p>
                <p>Method: MTN Mobile Money</p>
              </div>
              <button className="btn btn-gold btn-lg" style={{ width: '100%' }} onClick={handlePay}>
                Confirm Payment
              </button>
            </div>
          )}

          {paymentStep === 2 && (
            <div className="animate-scale-in" style={{ padding: 'var(--space-2xl)' }}>
              <div
                className="animate-spin"
                style={{
                  width: 60,
                  height: 60,
                  border: '4px solid var(--border-light)',
                  borderTopColor: 'var(--gold)',
                  borderRadius: '50%',
                  margin: '0 auto var(--space-lg)',
                }}
              />
              <p style={{ fontWeight: 600 }}>Processing Payment...</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Please confirm on your phone
              </p>
            </div>
          )}

          {paymentStep === 3 && (
            <div className="animate-scale-in" style={{ padding: 'var(--space-xl)' }}>
              <div style={{ fontSize: 64, marginBottom: 'var(--space-md)' }}>
                <OnlineLogoIcon name="party-popper" size={64} color="var(--emerald)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 4 }}>
                Payment Submitted!
              </h3>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                Pending admin approval. You&apos;ll receive a receipt once approved.
              </p>
              <button
                className="btn btn-gold"
                onClick={() => {
                  setSelectedType(null);
                  setPaymentStep(0);
                }}
              >
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
      <div
        className="tab-container"
        style={{ marginBottom: 'var(--space-lg)', width: '100%', display: 'flex' }}
      >
        {['types', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            className={`tab-btn ${view === tab ? 'active' : ''}`}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {tab === 'types' ? (
              <>
                <OnlineLogoIcon name="wallet" size={16} /> Contribute
              </>
            ) : (
              <>
                <OnlineLogoIcon name="history" size={16} /> History
              </>
            )}
          </button>
        ))}
      </div>

      {view === 'types' && (
        <div className="flex-col gap-sm animate-fade-in">
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              marginBottom: 'var(--space-sm)',
            }}
          >
            Choose Contribution
          </h2>
          {allOptions.map((ct) => (
            <button
              key={ct.id}
              className="glass-card"
              style={{
                padding: 'var(--space-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                width: '100%',
                textAlign: 'left',
              }}
              onClick={() => {
                setSelectedType(ct);
                setPaymentStep(0);
                setCustomAmount('');
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(212, 168, 67, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  flexShrink: 0,
                }}
              >
                <OnlineLogoIcon name={ct.icon || 'wallet'} size={24} color="var(--gold)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600 }}>{ct.name}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  {ct.category}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, color: 'var(--gold-dark)' }}>
                  {getAmount(ct) === 0
                    ? 'Custom Amount'
                    : formatCurrency(getAmount(ct), getCurrency(ct))}
                </p>
                {ct.recurring && (
                  <span className="badge badge-gold" style={{ fontSize: 9 }}>
                    Monthly
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {view === 'history' && (
        <div className="animate-fade-in">
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              marginBottom: 'var(--space-md)',
            }}
          >
            Contribution History
          </h2>
          <div className="timeline">
            {myContributions.map((c) => (
              <div key={c.id} className="timeline-item">
                <div className="glass-card-static" style={{ padding: 'var(--space-md)' }}>
                  <div className="flex-between" style={{ marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{c.type}</span>
                    <span
                      className={`badge ${c.status === 'approved' ? 'badge-green' : c.status === 'pending' ? 'badge-amber' : 'badge-red'}`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: 'var(--text-lg)',
                    }}
                  >
                    {formatCurrency(c.amount, c.currency)}
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-tertiary)',
                      marginTop: 4,
                    }}
                  >
                    {formatDate(c.date)} • Ref: {c.reference}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {myContributions.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <OnlineLogoIcon name="wallet" size={32} />
              </div>
              <p className="empty-state-title">No contributions yet</p>
              <p className="empty-state-description">Start contributing to support the ministry</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
