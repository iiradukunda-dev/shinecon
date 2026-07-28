'use client';
import { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatCurrency } from '@/lib/utils';
import { OnlineLogoIcon } from '@/components/icons';

const EMPTY = { title: '', description: '', goal: 0, currency: 'RWF', startDate: '', endDate: '', featured: false, image: 'target' };

export default function AdminCampaignsPage() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign, addToast } = useApp();
  const [modal, setModal] = useState(null);
  const [editData, setEditData] = useState(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreate = () => { setEditData({ ...EMPTY }); setModal('create'); };
  const openEdit = (c) => { setEditData({ ...c }); setModal('edit'); };

  const handleSave = () => {
    if (!editData.title || !editData.description || !editData.goal || !editData.currency || !editData.startDate || !editData.endDate || !editData.image) {
      addToast('All fields are required', 'error');
      return;
    }

    const data = { ...editData, goal: Number(editData.goal) };
    if (modal === 'create') addCampaign(data);
    else updateCampaign(editData.id, data);
    setModal(null);
  };

  const handleDelete = () => { deleteCampaign(deleteTarget.id); setDeleteTarget(null); };

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <div className="flex-between">
          <div><h1>Campaign Management</h1><p>Manage ministry fundraising campaigns</p></div>
          <button className="btn btn-gold" onClick={openCreate}>+ New Campaign</button>
        </div>
      </div>

      <div className="grid grid-2 animate-fade-in-up stagger-1">
        {campaigns.map(campaign => {
          const pct = Math.round((campaign.raised / campaign.goal) * 100) || 0;
          return (
            <div key={campaign.id} className="glass-card-static" style={{ padding: 'var(--space-lg)' }}>
              <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <OnlineLogoIcon name={campaign.image || 'church'} size={32} color="var(--gold)" />
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{campaign.title}</h3>
                    <span className={`badge ${campaign.status === 'active' ? 'badge-green' : campaign.status === 'completed' ? 'badge-blue' : 'badge-gray'}`}>{campaign.status}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(campaign)}><OnlineLogoIcon name="pencil" size={16} /></button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(campaign)} style={{ color: 'var(--soft-red)' }}><OnlineLogoIcon name="trash-2" size={16} /></button>
                </div>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', lineHeight: 1.5 }}>
                {campaign.description.substring(0, 100)}...
              </p>
              <div className="progress-bar" style={{ marginBottom: 'var(--space-sm)' }}>
                <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex-between" style={{ fontSize: 'var(--text-sm)' }}>
                <span><strong>{formatCurrency(campaign.raised, campaign.currency)}</strong> / {formatCurrency(campaign.goal, campaign.currency)}</span>
                <span style={{ fontWeight: 600, color: 'var(--gold-dark)' }}>{pct}%</span>
              </div>
              <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><OnlineLogoIcon name="users" size={12} /> {campaign.contributors} contributors</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{campaign.featured ? <><OnlineLogoIcon name="star" size={12} /> Featured</> : ''}</span>
                <span>Ends {campaign.endDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {campaigns.length === 0 && (
        <div className="empty-state"><div className="empty-state-icon"><OnlineLogoIcon name="target" size={32} /></div><p className="empty-state-title">No campaigns yet</p>
          <button className="btn btn-gold" onClick={openCreate}>Create First Campaign</button></div>
      )}

      {/* Create/Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{modal === 'create' ? '+ New Campaign' : <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><OnlineLogoIcon name="edit" size={16} /> Edit Campaign</span>}</h3>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="input-group"><label className="input-label">Title *</label>
                <input className="input" value={editData.title} onChange={e => setEditData(p => ({ ...p, title: e.target.value }))} placeholder="Campaign title" /></div>
              <div className="input-group"><label className="input-label">Description *</label>
                <textarea className="input" rows={2} value={editData.description} onChange={e => setEditData(p => ({ ...p, description: e.target.value }))} placeholder="Describe the campaign..." style={{ resize: 'vertical' }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                <div className="input-group"><label className="input-label">Goal Amount *</label>
                  <input className="input" type="number" value={editData.goal} onChange={e => setEditData(p => ({ ...p, goal: e.target.value }))} /></div>
                <div className="input-group"><label className="input-label">Currency *</label>
                  <select className="select" value={editData.currency} onChange={e => setEditData(p => ({ ...p, currency: e.target.value }))}>
                    <option>RWF</option></select></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                <div className="input-group"><label className="input-label">Start Date *</label>
                  <input className="input" type="date" value={editData.startDate} onChange={e => setEditData(p => ({ ...p, startDate: e.target.value }))} /></div>
                <div className="input-group"><label className="input-label">End Date *</label>
                  <input className="input" type="date" value={editData.endDate} onChange={e => setEditData(p => ({ ...p, endDate: e.target.value }))} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                <div className="input-group"><label className="input-label">Icon Name *</label>
                  <input className="input" value={editData.image} onChange={e => setEditData(p => ({ ...p, image: e.target.value }))} /></div>
                {modal === 'edit' && (
                  <div className="input-group"><label className="input-label">Status *</label>
                    <select className="select" value={editData.status} onChange={e => setEditData(p => ({ ...p, status: e.target.value }))}>
                      <option value="active">Active</option><option value="paused">Paused</option><option value="completed">Completed</option></select></div>
                )}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
                <input type="checkbox" checked={editData.featured || false} onChange={e => setEditData(p => ({ ...p, featured: e.target.checked }))} style={{ accentColor: 'var(--gold)' }} />
                Featured campaign
              </label>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-gold" onClick={handleSave}>{modal === 'create' ? 'Create Campaign' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-header"><h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--soft-red)', display: 'flex', alignItems: 'center', gap: 8 }}><OnlineLogoIcon name="alert-triangle" size={16} color="var(--soft-red)" /> Delete Campaign</h3>
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>✕</button></div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <p>Delete campaign <strong>{deleteTarget.title}</strong>?</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>This action cannot be undone.</p></div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
