import { OnlineLogoIcon } from '@/components/icons';

export function CampaignModal({
  modal,
  setModal,
  editData,
  setEditData,
  handleSave,
  deleteTarget,
  setDeleteTarget,
  handleDelete,
}) {
  if (modal === 'create' || modal === 'edit') {
    return (
      <div className="modal-overlay" onClick={() => setModal(null)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              {modal === 'create' ? (
                '+ New Campaign'
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <OnlineLogoIcon name="edit" size={16} /> Edit Campaign
                </span>
              )}
            </h3>
            <button className="btn btn-ghost" onClick={() => setModal(null)}>
              ✕
            </button>
          </div>
          <div className="modal-body">
            <div className="input-group">
              <label className="input-label">Title *</label>
              <input
                className="input"
                value={editData.title}
                onChange={(e) => setEditData((p) => ({ ...p, title: e.target.value }))}
                placeholder="Campaign title"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Description *</label>
              <textarea
                className="input"
                rows={2}
                value={editData.description}
                onChange={(e) => setEditData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe the campaign..."
                style={{ resize: 'vertical' }}
              />
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}
            >
              <div className="input-group">
                <label className="input-label">Goal Amount *</label>
                <input
                  className="input"
                  type="number"
                  value={editData.goal}
                  onChange={(e) => setEditData((p) => ({ ...p, goal: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Currency *</label>
                <select
                  className="select"
                  value={editData.currency}
                  onChange={(e) => setEditData((p) => ({ ...p, currency: e.target.value }))}
                >
                  <option>RWF</option>
                </select>
              </div>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}
            >
              <div className="input-group">
                <label className="input-label">Start Date *</label>
                <input
                  className="input"
                  type="date"
                  value={editData.startDate}
                  onChange={(e) => setEditData((p) => ({ ...p, startDate: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">End Date *</label>
                <input
                  className="input"
                  type="date"
                  value={editData.endDate}
                  onChange={(e) => setEditData((p) => ({ ...p, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}
            >
              <div className="input-group">
                <label className="input-label">Icon Name *</label>
                <input
                  className="input"
                  value={editData.image}
                  onChange={(e) => setEditData((p) => ({ ...p, image: e.target.value }))}
                />
              </div>
              {modal === 'edit' && (
                <div className="input-group">
                  <label className="input-label">Status *</label>
                  <select
                    className="select"
                    value={editData.status}
                    onChange={(e) => setEditData((p) => ({ ...p, status: e.target.value }))}
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              )}
            </div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
              }}
            >
              <input
                type="checkbox"
                checked={editData.featured || false}
                onChange={(e) => setEditData((p) => ({ ...p, featured: e.target.checked }))}
                style={{ accentColor: 'var(--gold)' }}
              />
              Featured campaign
            </label>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setModal(null)}>
              Cancel
            </button>
            <button className="btn btn-gold" onClick={handleSave}>
              {modal === 'create' ? 'Create Campaign' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              Campaign
            </h3>
            <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>
              ✕
            </button>
          </div>
          <div className="modal-body" style={{ textAlign: 'center' }}>
            <p>
              Delete campaign <strong>{deleteTarget.title}</strong>?
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

  return null;
}
