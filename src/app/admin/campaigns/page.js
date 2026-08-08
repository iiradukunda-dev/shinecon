'use client';
import { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatCurrency } from '@/lib/utils';
import { OnlineLogoIcon } from '@/components/icons';
import { CampaignModal } from '@/components/modals/CampaignModal';

const EMPTY = {
  title: '',
  description: '',
  goal: 0,
  currency: 'RWF',
  startDate: '',
  endDate: '',
  featured: false,
  image: 'target',
};

export default function AdminCampaignsPage() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign, addToast } = useApp();
  const [modal, setModal] = useState(null);
  const [editData, setEditData] = useState(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreate = () => {
    setEditData({ ...EMPTY });
    setModal('create');
  };
  const openEdit = (c) => {
    setEditData({ ...c });
    setModal('edit');
  };

  const handleSave = () => {
    if (
      !editData.title ||
      !editData.description ||
      !editData.goal ||
      !editData.currency ||
      !editData.startDate ||
      !editData.endDate ||
      !editData.image
    ) {
      addToast('All fields are required', 'error');
      return;
    }

    const data = { ...editData, goal: Number(editData.goal) };
    if (modal === 'create') addCampaign(data);
    else updateCampaign(editData.id, data);
    setModal(null);
  };

  const handleDelete = () => {
    deleteCampaign(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <div className="flex-between">
          <div>
            <h1>Campaign Management</h1>
            <p>Manage ministry fundraising campaigns</p>
          </div>
          <button className="btn btn-gold" onClick={openCreate}>
            + New Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-2 animate-fade-in-up stagger-1">
        {campaigns.map((campaign) => {
          const pct = Math.round((campaign.raised / campaign.goal) * 100) || 0;
          return (
            <div
              key={campaign.id}
              className="glass-card-static"
              style={{ padding: 'var(--space-lg)' }}
            >
              <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <OnlineLogoIcon name={campaign.image || 'church'} size={32} color="var(--gold)" />
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                      {campaign.title}
                    </h3>
                    <span
                      className={`badge ${campaign.status === 'active' ? 'badge-green' : campaign.status === 'completed' ? 'badge-blue' : 'badge-gray'}`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-action-glass edit" onClick={() => openEdit(campaign)} title="Edit">
                    <OnlineLogoIcon name="pencil" size={14} />
                  </button>
                  <button
                    className="btn-action-glass reject"
                    onClick={() => setDeleteTarget(campaign)}
                    title="Delete"
                  >
                    <OnlineLogoIcon name="trash-2" size={14} />
                  </button>
                </div>
              </div>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-md)',
                  lineHeight: 1.5,
                }}
              >
                {campaign.description.substring(0, 100)}...
              </p>
              <div className="progress-bar" style={{ marginBottom: 'var(--space-sm)' }}>
                <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex-between" style={{ fontSize: 'var(--text-sm)' }}>
                <span>
                  <strong>{formatCurrency(campaign.raised, campaign.currency)}</strong> /{' '}
                  {formatCurrency(campaign.goal, campaign.currency)}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--gold-dark)' }}>{pct}%</span>
              </div>
              <div
                style={{
                  marginTop: 'var(--space-md)',
                  paddingTop: 'var(--space-md)',

                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-tertiary)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <OnlineLogoIcon name="users" size={12} /> {campaign.contributors} contributors
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {campaign.featured ? (
                    <>
                      <OnlineLogoIcon name="star" size={12} /> Featured
                    </>
                  ) : (
                    ''
                  )}
                </span>
                <span>Ends {campaign.endDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {campaigns.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <OnlineLogoIcon name="target" size={32} />
          </div>
          <p className="empty-state-title">No campaigns yet</p>
          <button className="btn btn-gold" onClick={openCreate}>
            Create First Campaign
          </button>
        </div>
      )}

      <CampaignModal
        modal={modal}
        setModal={setModal}
        editData={editData}
        setEditData={setEditData}
        handleSave={handleSave}
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        handleDelete={handleDelete}
      />
    </div>
  );
}
