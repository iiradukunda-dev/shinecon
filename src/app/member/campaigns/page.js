'use client';
import { useApp } from '@/context/app-context';
import { formatCurrency } from '@/lib/utils';
import { OnlineLogoIcon } from '@/components/icons';
import { useRouter } from 'next/navigation';

export default function CampaignsPage() {
  const { campaigns } = useApp();
  const router = useRouter();
  return (
    <div className="page-member-content">
      <div className="page-header animate-fade-in-up">
        <h1>Campaigns</h1>
        <p>Support ministry projects and initiatives</p>
      </div>

      <div className="flex-col gap-md">
        {campaigns.map((campaign, i) => {
          const pct = Math.round((campaign.raised / campaign.goal) * 100);
          return (
            <div key={campaign.id} className={`campaign-card animate-fade-in-up stagger-${i + 1}`}>
              <div className="campaign-card-image" style={{
                background: campaign.status === 'completed'
                  ? 'linear-gradient(135deg, rgba(43,138,62,0.15), rgba(43,138,62,0.05))'
                  : 'linear-gradient(135deg, rgba(212,168,67,0.15), rgba(245,230,200,0.08))',
              }}>
                <OnlineLogoIcon name={campaign.image || 'church'} size={48} color={campaign.status === 'completed' ? 'var(--emerald)' : 'var(--gold)'} />
                {campaign.featured && (
                  <span className="badge badge-gold" style={{ position: 'absolute', top: 12, right: 12 }}>
                    <OnlineLogoIcon name="star" size={12} color="var(--gold)" /> Featured
                  </span>
                )}
                {campaign.status === 'completed' && (
                  <span className="badge badge-green" style={{ position: 'absolute', top: 12, right: 12 }}>
                    <OnlineLogoIcon name="check" size={12} color="var(--emerald)" /> Completed
                  </span>
                )}
              </div>
              <div className="campaign-card-body">
                <h3 className="campaign-card-title">{campaign.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', lineHeight: 1.5 }}>
                  {campaign.description}
                </p>
                <div className="progress-bar" style={{ marginBottom: 'var(--space-sm)' }}>
                  <div className="progress-bar-fill" style={{
                    width: `${pct}%`,
                    background: campaign.status === 'completed'
                      ? 'linear-gradient(90deg, var(--emerald), var(--emerald-light))'
                      : undefined,
                  }} />
                </div>
                <div className="campaign-card-stats">
                  <span><strong>{formatCurrency(campaign.raised, campaign.currency)}</strong> raised</span>
                  <span>{pct}% of {formatCurrency(campaign.goal, campaign.currency)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    👥 {campaign.contributors} contributors
                  </span>
                  {campaign.status === 'active' && (
                    <button className="btn btn-gold btn-sm" onClick={() => router.push('/member/contributions')}>Contribute</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
