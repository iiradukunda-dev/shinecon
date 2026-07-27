'use client';
import { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatDate } from '@/lib/utils';
import { OnlineLogoIcon } from '@/components/icons';

const EMPTY = { title: '', description: '', category: 'News', priority: 'normal', image: 'megaphone' };
const ICONS = ['megaphone', 'church', 'users', 'tent', 'star', 'music', 'bell', 'lightbulb', 'party-popper', 'heart'];

export default function AdminAnnouncementsPage() {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useApp();
  const [modal, setModal] = useState(null);
  const [editData, setEditData] = useState(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreate = () => { setEditData({ ...EMPTY }); setModal('create'); };
  const openEdit = (a) => { setEditData({ ...a }); setModal('edit'); };

  const handleSave = () => {
    if (modal === 'create') addAnnouncement(editData);
    else updateAnnouncement(editData.id, editData);
    setModal(null);
  };

  const handleDelete = () => { deleteAnnouncement(deleteTarget.id); setDeleteTarget(null); };

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <div className="flex-between">
          <div><h1>Announcements</h1><p>Manage ministry announcements</p></div>
          <button className="btn btn-gold" onClick={openCreate}>+ New Announcement</button>
        </div>
      </div>

      <div className="grid grid-auto animate-fade-in-up stagger-1">
        {[...announcements].sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0)).map(ann => (
          <div key={ann.id} className="glass-card-static" style={{ padding: 'var(--space-lg)' }}>
            <div className="flex-between" style={{ marginBottom: 'var(--space-sm)' }}>
              <OnlineLogoIcon name={ann.image || 'megaphone'} size={28} color="var(--gold)" />
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <span className={`badge ${ann.priority === 'high' ? 'badge-red' : ann.priority === 'normal' ? 'badge-blue' : 'badge-gray'}`}>{ann.priority}</span>
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(ann)}><OnlineLogoIcon name="pencil" size={16} /></button>
                <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(ann)} style={{ color: 'var(--soft-red)' }}><OnlineLogoIcon name="trash-2" size={16} /></button>
              </div>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-sm)', fontSize: 'var(--text-base)' }}>{ann.title}</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-md)' }}>{ann.description.substring(0, 80)}...</p>
            <div className="flex-between">
              <span className="badge badge-gold">{ann.category}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{formatDate(ann.date)}</span>
            </div>
          </div>
        ))}
      </div>

      {announcements.length === 0 && (
        <div className="empty-state"><div className="empty-state-icon"><OnlineLogoIcon name="megaphone" size={48} color="var(--gold)" /></div><p className="empty-state-title">No announcements</p>
          <button className="btn btn-gold" onClick={openCreate}>Create First Announcement</button></div>
      )}

      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{modal === 'create' ? '+ New Announcement' : <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><OnlineLogoIcon name="edit" size={16} /> Edit Announcement</span>}</h3>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="input-group"><label className="input-label">Title *</label>
                <input className="input" value={editData.title} onChange={e => setEditData(p => ({ ...p, title: e.target.value }))} /></div>
              <div className="input-group"><label className="input-label">Description *</label>
                <textarea className="input" rows={2} value={editData.description || ''} onChange={e => setEditData(p => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                <div className="input-group"><label className="input-label">Category</label>
                  <select className="select" value={editData.category} onChange={e => setEditData(p => ({ ...p, category: e.target.value }))}>
                    {['News', 'Events', 'Fundraising', 'Prayer', 'Youth', 'Other'].map(c => <option key={c}>{c}</option>)}</select></div>
                <div className="input-group"><label className="input-label">Priority</label>
                  <select className="select" value={editData.priority} onChange={e => setEditData(p => ({ ...p, priority: e.target.value }))}>
                    <option value="high">High</option><option value="normal">Normal</option><option value="low">Low</option></select></div>
              </div>
              <div className="input-group"><label className="input-label">Icon</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {ICONS.map(icon => (
                    <button key={icon} type="button" onClick={() => setEditData(p => ({ ...p, image: icon }))} style={{
                      width: 32, height: 32, borderRadius: 'var(--radius-sm)', fontSize: 16,
                      border: editData.image === icon ? '2px solid var(--gold)' : '1px solid var(--border-light)',
                      background: editData.image === icon ? 'rgba(212,168,67,0.1)' : 'var(--bg-secondary)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}><OnlineLogoIcon name={icon} size={16} /></button>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-gold" onClick={handleSave}>{modal === 'create' ? 'Publish' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-header"><h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--soft-red)', display: 'flex', alignItems: 'center', gap: 8 }}><OnlineLogoIcon name="alert-triangle" size={16} color="var(--soft-red)" /> Delete Announcement</h3>
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>✕</button></div>
            <div className="modal-body" style={{ textAlign: 'center' }}><p>Delete <strong>{deleteTarget.title}</strong>?</p></div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
