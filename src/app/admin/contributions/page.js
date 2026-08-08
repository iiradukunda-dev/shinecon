'use client';
import { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatCurrency, formatDate } from '@/lib/utils';
import { OnlineLogoIcon } from '@/components/icons';
import { ContributionModal } from '@/components/modals/ContributionModal';

export default function AdminContributionsPage() {
  const {
    contributions,
    approveContribution,
    rejectContribution,
    deleteContribution,
    contributionTypes,
    addContributionType,
    updateContributionType,
    deleteContributionType,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'types'

  // Transactions state
  const [filter, setFilter] = useState('all');
  const [selectedContrib, setSelectedContrib] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Types state
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [editTypeId, setEditTypeId] = useState(null);
  const [typeFormData, setTypeFormData] = useState({
    name: '',
    description: '',
    category: 'Regular',
    localStudent: 0,
    localEmployed: 0,
    diasporaStudent: 0,
    diasporaEmployed: 0,
    currency: 'RWF',
    recurring: false,
    active: true,
    icon: 'wallet',
    color: '#D4A843',
  });
  const [deleteTypeTarget, setDeleteTypeTarget] = useState(null);

  const filtered = contributions.filter((c) => filter === 'all' || c.status === filter);

  const handleDelete = () => {
    deleteContribution(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleDeleteType = () => {
    deleteContributionType(deleteTypeTarget.id);
    setDeleteTypeTarget(null);
  };

  const handleOpenTypeModal = (type = null) => {
    if (type) {
      setEditTypeId(type.id);
      setTypeFormData({
        name: type.name,
        description: type.description,
        category: type.category,
        localStudent: type.localStudent,
        localEmployed: type.localEmployed,
        diasporaStudent: type.diasporaStudent,
        diasporaEmployed: type.diasporaEmployed,
        currency: type.currency,
        recurring: type.recurring,
        active: type.active,
        icon: type.icon,
        color: type.color,
      });
    } else {
      setEditTypeId(null);
      setTypeFormData({
        name: '',
        description: '',
        category: 'Regular',
        localStudent: 0,
        localEmployed: 0,
        diasporaStudent: 0,
        diasporaEmployed: 0,
        currency: 'RWF',
        recurring: false,
        active: true,
        icon: 'wallet',
        color: '#D4A843',
      });
    }
    setShowTypeModal(true);
  };

  const handleSaveType = async (e) => {
    e.preventDefault();
    if (editTypeId) {
      await updateContributionType(editTypeId, typeFormData);
    } else {
      await addContributionType(typeFormData);
    }
    setShowTypeModal(false);
  };

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <h1>Contribution Management</h1>
        <p>Manage member contributions and configure contribution types.</p>
      </div>

      {/* Main Tabs */}
      <div
        className="tab-container animate-fade-in-up stagger-1"
        style={{ marginBottom: 'var(--space-xl)' }}
      >
        <button
          className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button
          className={`tab-btn ${activeTab === 'types' ? 'active' : ''}`}
          onClick={() => setActiveTab('types')}
        >
          Contribution Types
        </button>
      </div>

      {activeTab === 'transactions' && (
        <div className="animate-fade-in">
          {/* Filters */}
          <div className="tab-container" style={{ marginBottom: 'var(--space-md)' }}>
            {['all', 'pending', 'approved', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`tab-btn ${filter === f ? 'active' : ''}`}
                style={{ padding: '4px 12px', fontSize: 'var(--text-sm)' }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Reference</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{c.memberName}</td>
                    <td style={{ fontSize: 'var(--text-sm)' }}>{c.type}</td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                        {formatCurrency(c.amount, c.currency)}
                      </span>
                    </td>
                    <td>
                      <code
                        style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-tertiary)',
                          fontSize: 'var(--text-xs)',
                        }}
                      >
                        {c.reference}
                      </code>
                    </td>
                    <td style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                      {formatDate(c.date)}
                    </td>
                    <td>
                      <span
                        className={`badge ${c.status === 'approved' ? 'badge-green' : c.status === 'pending' ? 'badge-amber' : 'badge-red'}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {c.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-gold btn-sm"
                              onClick={() => approveContribution(c.id)}
                            >
                              ✓
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => rejectContribution(c.id)}
                            >
                              ✗
                            </button>
                          </>
                        )}
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setSelectedContrib(c)}
                        >
                          Details
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setDeleteTarget(c)}
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
        </div>
      )}

      {activeTab === 'types' && (
        <div className="animate-fade-in">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-lg)',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              Contribution Types
            </h2>
            <button className="btn btn-gold" onClick={() => handleOpenTypeModal()}>
              + New Type
            </button>
          </div>

          <div className="grid grid-3">
            {contributionTypes.map((ct) => (
              <div
                key={ct.id}
                className="glass-card-static"
                style={{ padding: 'var(--space-lg)', position: 'relative' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 'var(--space-md)',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-lg)',
                      background: `${ct.color}22`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: ct.color,
                    }}
                  >
                    <OnlineLogoIcon name={ct.icon || 'wallet'} size={24} />
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleOpenTypeModal(ct)}
                    >
                      <OnlineLogoIcon name="edit" size={16} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setDeleteTypeTarget(ct)}
                      style={{ color: 'var(--soft-red)' }}
                    >
                      <OnlineLogoIcon name="trash-2" size={16} />
                    </button>
                  </div>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 4 }}>
                  {ct.name}
                </h3>
                <p
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-md)',
                  }}
                >
                  {ct.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    marginBottom: 'var(--space-md)',
                    flexWrap: 'wrap',
                  }}
                >
                  <span className="badge badge-gold">{ct.category}</span>
                  {ct.recurring && <span className="badge badge-green">Recurring</span>}
                  {!ct.active && <span className="badge badge-red">Inactive</span>}
                </div>

                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    background: 'var(--bg-tertiary)',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}
                  >
                    <span style={{ color: 'var(--text-tertiary)' }}>Local (Student/Emp)</span>
                    <span style={{ fontWeight: 600 }}>
                      {ct.localStudent} / {ct.localEmployed} {ct.currency}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Diaspora (Student/Emp)</span>
                    <span style={{ fontWeight: 600 }}>
                      {ct.diasporaStudent} / {ct.diasporaEmployed} {ct.currency}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {contributionTypes.length === 0 && (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                <p>No contribution types created yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <ContributionModal
        selectedContrib={selectedContrib}
        setSelectedContrib={setSelectedContrib}
        approveContribution={approveContribution}
        rejectContribution={rejectContribution}
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        handleDelete={handleDelete}
        showTypeModal={showTypeModal}
        setShowTypeModal={setShowTypeModal}
        editTypeId={editTypeId}
        typeFormData={typeFormData}
        setTypeFormData={setTypeFormData}
        handleSaveType={handleSaveType}
        deleteTypeTarget={deleteTypeTarget}
        setDeleteTypeTarget={setDeleteTypeTarget}
        handleDeleteType={handleDeleteType}
      />
    </div>
  );
}
