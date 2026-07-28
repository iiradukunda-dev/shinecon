'use client';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/app-context';
import { formatDate } from '@/lib/utils';
import { OnlineLogoIcon } from '@/components/icons';

export default function AdminEventsPage() {
  const { events, addEvent, updateEvent, deleteEvent } = useApp();
  const [modal, setModal] = useState(null);
  const [editData, setEditData] = useState(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Custom Location Search state
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleLocationSearch = (query) => {
    setLocationQuery(query);
    setEditData(p => ({ ...p, location: query }));
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    if (!query.trim()) {
      setLocationResults([]);
      return;
    }

    setIsSearchingLocation(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        setLocationResults(data);
      } catch (err) {
        console.error('Location search failed', err);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 500);
  };

  const selectLocation = (place) => {
    const locName = place.display_name;
    setEditData(p => ({ ...p, location: locName }));
    setLocationQuery(locName);
    setLocationResults([]);
  };

  const openCreate = () => { setEditData({ ...EMPTY }); setLocationQuery(''); setLocationResults([]); setModal('create'); };
  const openEdit = (e) => { setEditData({ ...e }); setLocationQuery(e.location || ''); setLocationResults([]); setModal('edit'); };

  const handleSave = () => {
    if (modal === 'create') addEvent(editData);
    else updateEvent(editData.id, editData);
    setModal(null);
  };

  const handleDelete = () => { deleteEvent(deleteTarget.id); setDeleteTarget(null); };

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <div className="flex-between">
          <div><h1>Event Management</h1><p>Calendar and event administration</p></div>
          <button className="btn btn-gold" onClick={openCreate}>+ New Event</button>
        </div>
      </div>

      <div className="table-container animate-fade-in-up stagger-1">
        <table className="table">
          <thead><tr><th>Event</th><th>Date</th><th>Time</th><th>Location</th><th>Category</th><th>Actions</th></tr></thead>
          <tbody>
            {events.map(e => (
              <tr key={e.id}>
                <td style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{e.title}</td>
                <td style={{ fontSize: 'var(--text-sm)' }}>{formatDate(e.date)}</td>
                <td style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{e.time}</td>
                <td style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  {e.location ? (
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.location)}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                      {e.location}
                    </a>
                  ) : ''}
                </td>
                <td><span className="badge badge-gold">{e.category}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(e)}><OnlineLogoIcon name="edit" size={16} /></button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(e)} style={{ color: 'var(--soft-red)' }}><OnlineLogoIcon name="trash-2" size={16} color="var(--soft-red)" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {events.length === 0 && (
        <div className="empty-state"><div className="empty-state-icon"><OnlineLogoIcon name="calendar" size={32} /></div><p className="empty-state-title">No events</p>
          <button className="btn btn-gold" onClick={openCreate}>Create First Event</button></div>
      )}

      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{modal === 'create' ? '+ New Event' : <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><OnlineLogoIcon name="edit" size={16} /> Edit Event</span>}</h3>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="input-group"><label className="input-label">Title *</label>
                <input className="input" value={editData.title} onChange={e => setEditData(p => ({ ...p, title: e.target.value }))} /></div>
              <div className="input-group"><label className="input-label">Description</label>
                <textarea className="input" rows={2} value={editData.description || ''} onChange={e => setEditData(p => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                <div className="input-group"><label className="input-label">Date *</label>
                  <input className="input" type="date" value={editData.date} onChange={e => setEditData(p => ({ ...p, date: e.target.value }))} /></div>
                <div className="input-group"><label className="input-label">Time *</label>
                  <input className="input" type="time" value={editData.time} onChange={e => setEditData(p => ({ ...p, time: e.target.value }))} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                <div className="input-group" style={{ position: 'relative' }}>
                  <label className="input-label">Location Search</label>
                  <input 
                    className="input" 
                    value={locationQuery} 
                    onChange={e => handleLocationSearch(e.target.value)} 
                    placeholder="Search location..."
                  />
                  {isSearchingLocation && <div style={{ position: 'absolute', right: 10, top: 38, fontSize: 12, color: 'var(--text-secondary)' }}>Searching...</div>}
                  
                  {locationResults.length > 0 && (
                    <div style={{ 
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, 
                      background: 'var(--surface-light)', border: '1px solid var(--border)', 
                      borderRadius: 8, marginTop: 4, maxHeight: 200, overflowY: 'auto',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                    }}>
                      {locationResults.map((place, i) => (
                        <div 
                          key={i} 
                          style={{ padding: '10px 12px', fontSize: 13, cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                          onClick={() => selectLocation(place)}
                          onMouseEnter={(e) => e.target.style.background = 'var(--glass-bg)'}
                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                          {place.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="input-group"><label className="input-label">Category</label>
                  <select className="select" value={editData.category} onChange={e => setEditData(p => ({ ...p, category: e.target.value }))}>
                    {['Worship', 'Youth', 'Prayer', 'Conference', 'Music', 'Outreach', 'Other'].map(c => <option key={c}>{c}</option>)}</select></div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
                <input type="checkbox" checked={editData.recurring || false} onChange={e => setEditData(p => ({ ...p, recurring: e.target.checked }))} style={{ accentColor: 'var(--gold)' }} /> Recurring event
              </label>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-gold" onClick={handleSave}>{modal === 'create' ? 'Create Event' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-header"><h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--soft-red)', display: 'flex', alignItems: 'center', gap: 8 }}><OnlineLogoIcon name="alert-triangle" size={16} color="var(--soft-red)" /> Delete Event</h3>
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>✕</button></div>
            <div className="modal-body" style={{ textAlign: 'center' }}><p>Delete event <strong>{deleteTarget.title}</strong>?</p></div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
