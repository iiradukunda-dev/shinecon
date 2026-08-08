'use client';
import { useState } from 'react';
import { useApp } from '@/context/app-context';
import { getInitials, formatDate } from '@/lib/utils';
import { OnlineLogoIcon } from '@/components/icons';
import { MemberModal } from '@/components/modals/MemberModal';

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
                  <div style={{ display: 'flex', gap: 4 }}>
                    {m.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-gold btn-sm"
                          onClick={() => approveMember(m.id)}
                          title="Approve"
                        >
                          ✓
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => rejectMember(m.id)}
                          title="Reject"
                        >
                          ✗
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => openEdit(m)}
                      title="Edit"
                    >
                      <OnlineLogoIcon name="edit" size={16} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => openDelete(m)}
                      title="Delete"
                      style={{ color: 'var(--soft-red)' }}
                    >
                      <OnlineLogoIcon name="trash-2" size={16} color="var(--soft-red)" />
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

      <MemberModal
        modal={modal}
        setModal={setModal}
        editData={editData}
        setEditData={setEditData}
        handleSave={handleSave}
        deleteTarget={deleteTarget}
        handleDelete={handleDelete}
      />
    </div>
  );
}
