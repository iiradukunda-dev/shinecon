'use client';
import { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatCurrency, formatDate } from '@/lib/utils';
import { OnlineLogoIcon } from '@/components/icons';

export default function AdminContributionsPage() {
  const { contributions, approveContribution, rejectContribution, deleteContribution, addToast } = useApp();
  const [filter, setFilter] = useState('all');
  const [selectedContrib, setSelectedContrib] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = contributions.filter(c => filter === 'all' || c.status === filter);

  const handleDelete = () => {
    deleteContribution(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <h1>Contribution Management</h1>
        <p>{contributions.length} total • {contributions.filter(c => c.status === 'pending').length} pending approval</p>
      </div>

      {/* Filters */}
      <div className="tab-container animate-fade-in-up stagger-1">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`tab-btn ${filter === f ? 'active' : ''}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-container animate-fade-in-up stagger-2">
        <table className="table">
          <thead>
            <tr><th>Member</th><th>Type</th><th>Amount</th><th>Reference</th><th>Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{c.memberName}</td>
                <td style={{ fontSize: 'var(--text-sm)' }}>{c.type}</td>
                <td><span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{formatCurrency(c.amount, c.currency)}</span></td>
                <td><code style={{ padding: '2px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', fontSize: 'var(--text-xs)' }}>{c.reference}</code></td>
                <td style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{formatDate(c.date)}</td>
                <td><span className={`badge ${c.status === 'approved' ? 'badge-green' : c.status === 'pending' ? 'badge-amber' : 'badge-red'}`}>{c.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {c.status === 'pending' && (
                      <>
                        <button className="btn btn-gold btn-sm" onClick={() => approveContribution(c.id)}>✓ Approve</button>
                        <button className="btn btn-danger btn-sm" onClick={() => rejectContribution(c.id)}>✗</button>
                      </>
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelectedContrib(c)}>Details</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(c)} style={{ color: 'var(--soft-red)' }}><OnlineLogoIcon name="trash-2" size={16} color="var(--soft-red)" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedContrib && (
        <div className="modal-overlay" onClick={() => setSelectedContrib(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Contribution Details</h3>
              <button className="btn btn-ghost" onClick={() => setSelectedContrib(null)}>✕</button>
            </div>
            <div className="modal-body">
              {[
                { label: 'Member', value: selectedContrib.memberName },
                { label: 'Type', value: selectedContrib.type },
                { label: 'Amount', value: formatCurrency(selectedContrib.amount, selectedContrib.currency) },
                { label: 'Reference', value: selectedContrib.reference },
                { label: 'Phone', value: selectedContrib.phone },
                { label: 'Date', value: formatDate(selectedContrib.date) },
                { label: 'Status', value: selectedContrib.status },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{item.label}</span>
                  <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              {selectedContrib.status === 'pending' && (
                <>
                  <button className="btn btn-gold" onClick={() => { approveContribution(selectedContrib.id); setSelectedContrib(null); }}>✓ Approve</button>
                  <button className="btn btn-danger" onClick={() => { rejectContribution(selectedContrib.id); setSelectedContrib(null); }}>✗ Reject</button>
                </>
              )}
              <button className="btn btn-secondary" onClick={() => setSelectedContrib(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--soft-red)', display: 'flex', alignItems: 'center', gap: 8 }}><OnlineLogoIcon name="alert-triangle" size={16} color="var(--soft-red)" /> Delete Contribution</h3>
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <p>Delete contribution of <strong>{formatCurrency(deleteTarget.amount, deleteTarget.currency)}</strong> by {deleteTarget.memberName}?</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
