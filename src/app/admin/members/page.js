'use client';
import { useState } from 'react';
import { useApp } from '@/context/app-context';
import { getInitials, formatDate } from '@/lib/utils';
import { OnlineLogoIcon } from '@/components/icons';

const EMPTY_MEMBER = {
  name: '',
  email: '',
  phone: '',
  country: 'Rwanda',
  type: 'local',
  employment: 'employed',
};

export default function AdminMembersPage() {
  const { members, addMember, updateMember, deleteMember, approveMember, rejectMember, addToast } =
    useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // 'create' | 'edit' | 'delete' | null
  const [editData, setEditData] = useState(EMPTY_MEMBER);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = members.filter((m) => {
    if (filter !== 'all' && m.status !== filter) return false;
    if (
      search &&
      !m.name.toLowerCase().includes(search.toLowerCase()) &&
      !m.email.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const openCreate = () => {
    setEditData({ ...EMPTY_MEMBER });
    setModal('create');
  };
  const openEdit = (m) => {
    setEditData({ ...m });
    setModal('edit');
  };
  const openDelete = (m) => {
    setDeleteTarget(m);
    setModal('delete');
  };

  const handleSave = () => {
    if (!editData.name || !editData.email) {
      addToast('Name and email are required', 'error');
      return;
    }
    if (modal === 'create') addMember(editData);
    else updateMember(editData.id, editData);
    setModal(null);
  };

  const handleDelete = () => {
    deleteMember(deleteTarget.id);
    setModal(null);
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <div className="flex-between">
          <div>
            <h1>Member Management</h1>
            <p>
              {members.length} total members •{' '}
              {members.filter((m) => m.status === 'pending').length} pending approval
            </p>
          </div>
          <button className="btn btn-gold" onClick={openCreate}>
            + Add Member
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        className="flex-between animate-fade-in-up stagger-1"
        style={{ marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-sm)' }}
      >
        <div className="tab-container">
          {['all', 'approved', 'pending', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`tab-btn ${filter === f ? 'active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          className="input"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
        />
      </div>

      {/* Table */}
      <div className="table-container animate-fade-in-up stagger-2">
        <table className="table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Contact</th>
              <th>Country</th>
              <th>Type</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(m.name)}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{m.name}</p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                        {m.employment}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <p style={{ fontSize: 'var(--text-sm)' }}>{m.email}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    {m.phone}
                  </p>
                </td>
                <td style={{ fontSize: 'var(--text-sm)' }}>{m.country}</td>
                <td>
                  <span className={`badge ${m.type === 'local' ? 'badge-gold' : 'badge-blue'}`}>
                    {m.type}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${m.status === 'approved' ? 'badge-green' : m.status === 'pending' ? 'badge-amber' : 'badge-red'}`}
                  >
                    {m.status}
                  </span>
                </td>
                <td style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  {formatDate(m.joinedDate)}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {m.status === 'pending' && (
                      <>
                        <button
                          className="btn-action-glass approve"
                          onClick={() => approveMember(m.id)}
                          title="Approve"
                        >
                          ✓
                        </button>
                        <button
                          className="btn-action-glass reject"
                          onClick={() => rejectMember(m.id)}
                          title="Reject"
                        >
                          ✗
                        </button>
                      </>
                    )}
                    <button
                      className="btn-action-glass edit"
                      onClick={() => openEdit(m)}
                      title="Edit"
                    >
                      <OnlineLogoIcon name="edit" size={14} />
                    </button>
                    <button
                      className="btn-action-glass reject"
                      onClick={() => openDelete(m)}
                      title="Delete"
                    >
                      <OnlineLogoIcon name="trash-2" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <OnlineLogoIcon name="users" size={32} />
          </div>
          <p className="empty-state-title">No members found</p>
          <p className="empty-state-description">Try adjusting your filters or add a new member</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                {modal === 'create' ? (
                  '+ Add Member'
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <OnlineLogoIcon name="edit" size={16} /> Edit Member
                  </span>
                )}
              </h3>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}
              >
                <div className="input-group">
                  <label className="input-label">Full Name *</label>
                  <input
                    className="input"
                    value={editData.name}
                    onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Full name"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Email *</label>
                  <input
                    className="input"
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone</label>
                  <input
                    className="input"
                    value={editData.phone}
                    onChange={(e) => setEditData((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+250 78X XXX XXX"
                  />
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 'var(--space-sm)',
                }}
              >
                <div className="input-group">
                  <label className="input-label">Country</label>
                  <select
                    className="select"
                    value={editData.country}
                    onChange={(e) => setEditData((p) => ({ ...p, country: e.target.value }))}
                  >
                    {[
                      'Rwanda',
                      'Belgium',
                      'Canada',
                      'France',
                      'Germany',
                      'United Kingdom',
                      'United States',
                      'Other',
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Type</label>
                  <select
                    className="select"
                    value={editData.type}
                    onChange={(e) => setEditData((p) => ({ ...p, type: e.target.value }))}
                  >
                    <option value="local">Local</option>
                    <option value="diaspora">Diaspora</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Employment</label>
                  <select
                    className="select"
                    value={editData.employment}
                    onChange={(e) => setEditData((p) => ({ ...p, employment: e.target.value }))}
                  >
                    <option value="employed">Employed</option>
                    <option value="student">Student</option>
                  </select>
                </div>
              </div>
              {modal === 'edit' && (
                <div className="input-group">
                  <label className="input-label">Status</label>
                  <select
                    className="select"
                    value={editData.status}
                    onChange={(e) => setEditData((p) => ({ ...p, status: e.target.value }))}
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button className="btn btn-gold" onClick={handleSave}>
                {modal === 'create' ? 'Add Member' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {modal === 'delete' && deleteTarget && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--soft-red)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <OnlineLogoIcon name="alert-triangle" size={16} color="var(--soft-red)" /> Delete
                Member
              </h3>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <p>
                Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
              </p>
              <p
                style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 4 }}
              >
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
