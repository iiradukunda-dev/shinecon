'use client';
import { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatDate } from '@/lib/demo-data';

const EMPTY = { event: '', date: '', total: 0, capacity: 250 };

export default function AdminAttendancePage() {
  const { attendance, events, addAttendance, updateAttendance, deleteAttendance, addToast } = useApp();
  const [modal, setModal] = useState(null);
  const [editData, setEditData] = useState(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreate = () => { setEditData({ ...EMPTY, date: new Date().toISOString().split('T')[0] }); setModal('create'); };
  const openEdit = (a) => { setEditData({ ...a }); setModal('edit'); };

  const handleSave = () => {
    if (!editData.event || !editData.date) { addToast('Event name and date are required', 'error'); return; }
    if (modal === 'create') addAttendance(editData);
    else updateAttendance(editData.id, editData);
    setModal(null);
  };

  const handleDelete = () => { deleteAttendance(deleteTarget.id); setDeleteTarget(null); };

  const avgAttendance = attendance.length > 0
    ? Math.round(attendance.reduce((a, b) => a + b.total, 0) / attendance.length) : 0;
  const avgRate = attendance.length > 0
    ? Math.round(attendance.reduce((a, b) => a + (b.total / b.capacity) * 100, 0) / attendance.length) : 0;

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <div className="flex-between">
          <div><h1>Attendance Management</h1><p>QR attendance sessions and records</p></div>
          <button className="btn btn-gold" onClick={openCreate}>+ New Session</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-3 animate-fade-in-up stagger-1" style={{ marginBottom: 'var(--space-xl)' }}>
        {[
          { label: 'Total Sessions', value: attendance.length, icon: '📋', bg: 'rgba(212,168,67,0.1)' },
          { label: 'Avg Attendance', value: avgAttendance, icon: '👥', bg: 'rgba(43,138,62,0.1)' },
          { label: 'Avg Rate', value: `${avgRate}%`, icon: '📊', bg: 'rgba(59,91,219,0.1)' },
        ].map(s => (
          <div key={s.label} className="stat-card glass-card-static">
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="table-container animate-fade-in-up stagger-2">
        <table className="table">
          <thead><tr><th>Event</th><th>Date</th><th>Attendees</th><th>Capacity</th><th>Rate</th><th>Actions</th></tr></thead>
          <tbody>
            {attendance.map(att => {
              const rate = Math.round((att.total / att.capacity) * 100);
              return (
                <tr key={att.id}>
                  <td style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{att.event}</td>
                  <td style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{formatDate(att.date)}</td>
                  <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{att.total}</td>
                  <td style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{att.capacity}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ width: 60, height: 6 }}>
                        <div className="progress-bar-fill" style={{ width: `${Math.min(rate, 100)}%` }} />
                      </div>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{rate}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(att)} title="Edit">✏️</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(att)} title="Delete" style={{ color: 'var(--soft-red)' }}>🗑</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {attendance.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-title">No attendance sessions</p>
          <p className="empty-state-description">Record your first attendance session</p>
          <button className="btn btn-gold" onClick={openCreate} style={{ marginTop: 'var(--space-md)' }}>+ New Session</button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                {modal === 'create' ? '+ New Attendance Session' : '✏️ Edit Session'}
              </h3>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label className="input-label">Event / Service Name *</label>
                {events.length > 0 ? (
                  <select className="select" value={editData.event} onChange={e => setEditData(p => ({ ...p, event: e.target.value }))}>
                    <option value="">— Select an event —</option>
                    {events.map(ev => <option key={ev.id} value={ev.title}>{ev.title}</option>)}
                    <option value="__custom__">Other (custom)...</option>
                  </select>
                ) : (
                  <input className="input" value={editData.event} onChange={e => setEditData(p => ({ ...p, event: e.target.value }))} placeholder="e.g. Sunday Worship Service" />
                )}
                {editData.event === '__custom__' && (
                  <input className="input" style={{ marginTop: 8 }} placeholder="Enter custom event name" onChange={e => {
                    if (e.target.value) setEditData(p => ({ ...p, event: e.target.value }));
                  }} />
                )}
              </div>

              <div className="input-group">
                <label className="input-label">Date *</label>
                <input className="input" type="date" value={editData.date} onChange={e => setEditData(p => ({ ...p, date: e.target.value }))} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                <div className="input-group">
                  <label className="input-label">Total Attendees</label>
                  <input className="input" type="number" min="0" value={editData.total} onChange={e => setEditData(p => ({ ...p, total: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label className="input-label">Venue Capacity</label>
                  <input className="input" type="number" min="1" value={editData.capacity} onChange={e => setEditData(p => ({ ...p, capacity: e.target.value }))} />
                </div>
              </div>

              {editData.total > 0 && editData.capacity > 0 && (
                <div style={{
                  padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)',
                  background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)',
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 4 }}>Attendance Rate</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-2xl)', color: 'var(--gold-dark)' }}>
                    {Math.round((Number(editData.total) / Number(editData.capacity)) * 100)}%
                  </p>
                  <div className="progress-bar" style={{ marginTop: 8 }}>
                    <div className="progress-bar-fill" style={{ width: `${Math.min(Math.round((Number(editData.total) / Number(editData.capacity)) * 100), 100)}%` }} />
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-gold" onClick={handleSave}>
                {modal === 'create' ? 'Record Session' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--soft-red)' }}>⚠️ Delete Session</h3>
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <p>Delete attendance session for <strong>{deleteTarget.event}</strong> on {formatDate(deleteTarget.date)}?</p>
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
