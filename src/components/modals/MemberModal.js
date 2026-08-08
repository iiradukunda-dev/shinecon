import { OnlineLogoIcon } from '@/components/icons';

export function MemberModal({
  modal,
  setModal,
  editData,
  setEditData,
  handleSave,
  deleteTarget,
  handleDelete,
}) {
  if (modal === 'delete' && deleteTarget) {
    return (
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
    );
  }

  if (modal === 'create' || modal === 'edit') {
    return (
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
    );
  }

  return null;
}
