import { formatCurrency, formatDate } from '@/lib/utils';
import { OnlineLogoIcon } from '@/components/icons';

export function ContributionModal({
  selectedContrib,
  setSelectedContrib,
  approveContribution,
  rejectContribution,
  deleteTarget,
  setDeleteTarget,
  handleDelete,
  showTypeModal,
  setShowTypeModal,
  editTypeId,
  typeFormData,
  setTypeFormData,
  handleSaveType,
  deleteTypeTarget,
  setDeleteTypeTarget,
  handleDeleteType,
}) {
  // Transaction Detail Modal
  if (selectedContrib) {
    return (
      <div className="modal-overlay" onClick={() => setSelectedContrib(null)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              Contribution Details
            </h3>
            <button className="btn btn-ghost" onClick={() => setSelectedContrib(null)}>
              ✕
            </button>
          </div>
          <div className="modal-body">
            {[
              { label: 'Member', value: selectedContrib.memberName },
              { label: 'Type', value: selectedContrib.type },
              {
                label: 'Amount',
                value: formatCurrency(selectedContrib.amount, selectedContrib.currency),
              },
              { label: 'Reference', value: selectedContrib.reference },
              { label: 'Phone', value: selectedContrib.phone },
              { label: 'Date', value: formatDate(selectedContrib.date) },
              { label: 'Status', value: selectedContrib.status },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                }}
              >
                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  {item.label}
                </span>
                <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="modal-footer">
            {selectedContrib.status === 'pending' && (
              <>
                <button
                  className="btn btn-gold"
                  onClick={() => {
                    approveContribution(selectedContrib.id);
                    setSelectedContrib(null);
                  }}
                >
                  ✓ Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    rejectContribution(selectedContrib.id);
                    setSelectedContrib(null);
                  }}
                >
                  ✗ Reject
                </button>
              </>
            )}
            <button className="btn btn-secondary" onClick={() => setSelectedContrib(null)}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Transaction Delete Modal
  if (deleteTarget) {
    return (
      <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
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
              Contribution
            </h3>
            <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>
              ✕
            </button>
          </div>
          <div className="modal-body" style={{ textAlign: 'center' }}>
            <p>
              Delete contribution of{' '}
              <strong>{formatCurrency(deleteTarget.amount, deleteTarget.currency)}</strong> by{' '}
              {deleteTarget.memberName}?
            </p>
            <p
              style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 4 }}
            >
              This action cannot be undone.
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Type Edit/Create Modal
  if (showTypeModal) {
    return (
      <div className="modal-overlay" onClick={() => setShowTypeModal(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
          <form onSubmit={handleSaveType}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                {editTypeId ? 'Edit Contribution Type' : 'New Contribution Type'}
              </h3>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowTypeModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="grid grid-2" style={{ gap: 'var(--space-md)' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">Name</label>
                  <input
                    className="input"
                    required
                    value={typeFormData.name}
                    onChange={(e) => setTypeFormData({ ...typeFormData, name: e.target.value })}
                    placeholder="e.g. Monthly Contribution"
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">Description</label>
                  <textarea
                    className="input"
                    value={typeFormData.description}
                    onChange={(e) =>
                      setTypeFormData({ ...typeFormData, description: e.target.value })
                    }
                    placeholder="Brief description..."
                  />
                </div>
                <div>
                  <label className="input-label">Category</label>
                  <input
                    className="input"
                    value={typeFormData.category}
                    onChange={(e) => setTypeFormData({ ...typeFormData, category: e.target.value })}
                    placeholder="e.g. Regular, Project"
                  />
                </div>
                <div>
                  <label className="input-label">Currency</label>
                  <input
                    className="input"
                    value={typeFormData.currency}
                    onChange={(e) => setTypeFormData({ ...typeFormData, currency: e.target.value })}
                    placeholder="e.g. RWF, USD"
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <h4
                    style={{
                      margin: 'var(--space-sm) 0',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--gold)',
                    }}
                  >
                    Amounts
                  </h4>
                </div>
                <div>
                  <label className="input-label">Local Student</label>
                  <input
                    type="number"
                    className="input"
                    required
                    value={typeFormData.localStudent}
                    onChange={(e) =>
                      setTypeFormData({ ...typeFormData, localStudent: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="input-label">Local Employed</label>
                  <input
                    type="number"
                    className="input"
                    required
                    value={typeFormData.localEmployed}
                    onChange={(e) =>
                      setTypeFormData({ ...typeFormData, localEmployed: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="input-label">Diaspora Student</label>
                  <input
                    type="number"
                    className="input"
                    required
                    value={typeFormData.diasporaStudent}
                    onChange={(e) =>
                      setTypeFormData({
                        ...typeFormData,
                        diasporaStudent: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="input-label">Diaspora Employed</label>
                  <input
                    type="number"
                    className="input"
                    required
                    value={typeFormData.diasporaEmployed}
                    onChange={(e) =>
                      setTypeFormData({
                        ...typeFormData,
                        diasporaEmployed: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <h4
                    style={{
                      margin: 'var(--space-sm) 0',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--gold)',
                    }}
                  >
                    Settings
                  </h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={typeFormData.recurring}
                    onChange={(e) =>
                      setTypeFormData({ ...typeFormData, recurring: e.target.checked })
                    }
                  />
                  <label htmlFor="recurring" style={{ fontWeight: 500 }}>
                    Recurring (Monthly)
                  </label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    id="active"
                    checked={typeFormData.active}
                    onChange={(e) => setTypeFormData({ ...typeFormData, active: e.target.checked })}
                  />
                  <label htmlFor="active" style={{ fontWeight: 500 }}>
                    Active (Visible to members)
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowTypeModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-gold">
                Save Type
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Type Delete Modal
  if (deleteTypeTarget) {
    return (
      <div className="modal-overlay" onClick={() => setDeleteTypeTarget(null)}>
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
              <OnlineLogoIcon name="alert-triangle" size={16} color="var(--soft-red)" /> Delete Type
            </h3>
            <button className="btn btn-ghost" onClick={() => setDeleteTypeTarget(null)}>
              ✕
            </button>
          </div>
          <div className="modal-body" style={{ textAlign: 'center' }}>
            <p>
              Are you sure you want to delete <strong>{deleteTypeTarget.name}</strong>?
            </p>
            <p
              style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 4 }}
            >
              This will remove it from member options. Past contributions of this type will also be
              deleted.
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setDeleteTypeTarget(null)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDeleteType}>
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
