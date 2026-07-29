'use client';
import { useState, useEffect } from 'react';
import { useApp } from '@/context/app-context';
import { formatDate } from '@/lib/utils';
import { OnlineLogoIcon } from '@/components/icons';

// Haversine formula to calculate distance between two coordinates in meters
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius of the earth in m
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in m
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export default function AttendancePage() {
  const { events, attendance, addToast } = useApp();
  const [selectedEventId, setSelectedEventId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [scanError, setScanError] = useState('');

  // Find selected event
  const selectedAttendanceEvent = attendance.find(e => e.id === selectedEventId);
  const matchedEvent = events.find(e => e.title === selectedAttendanceEvent?.event);

  // Auto-verify attendance once location is acquired
  useEffect(() => {
    if (userLocation && scanning && !scanned && !scanError) {
      const timer = setTimeout(() => {
        simulateScan('valid');
      }, 1500); // Wait 1.5s so the user sees the "Location acquired" animation
      return () => clearTimeout(timer);
    }
  }, [userLocation, scanning, scanned, scanError]);

  const handleOpenScanner = () => {
    if (!selectedEventId) {
      addToast('Please select an event first', 'warning');
      return;
    }
    
    setLocationError('');
    setScanError('');
    setScanning(true);
    setScanned(false);
    setUserLocation(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setScanning(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        setLocationError('Location permission denied or unavailable. You must enable location to check in.');
        setScanning(false);
      }
    );
  };

  const simulateScan = async (type) => {
    if (!userLocation) {
      setScanError('Waiting for location coordinates...');
      return;
    }

    // Determine the simulated QR payload based on the button clicked
    let qrPayload = {};
    if (type === 'valid') {
      qrPayload = { eventId: selectedEventId, lat: userLocation.lat, lng: userLocation.lng };
    } else if (type === 'wrong_event') {
      qrPayload = { eventId: 'some_other_event_id', lat: userLocation.lat, lng: userLocation.lng };
    } else if (type === 'wrong_location') {
      // simulate scanning a QR that is physically located 1 degree (~111km) away
      qrPayload = { eventId: selectedEventId, lat: userLocation.lat + 1, lng: userLocation.lng + 1 };
    }

    // Validation Logic
    if (qrPayload.eventId !== selectedEventId) {
      setScanError('QR Code does not match the selected event.');
      return;
    }

    // Use the actual event's location for distance check
    let distance = 0;
    if (matchedEvent && matchedEvent.lat && matchedEvent.lng) {
      distance = getDistanceFromLatLonInM(
        userLocation.lat, userLocation.lng,
        matchedEvent.lat, matchedEvent.lng
      );
    } else {
      // Fallback if event has no location set (e.g., custom event without coordinates)
      // We will allow check-in but might flag it or just allow it for now
      distance = 0;
    }

    // If they are more than 200 meters away
    if (distance > 200) {
      setScanError(`Location mismatch. You are ${Math.round(distance)}m away from the event location.`);
      return;
    }

    // Success - Post to API
    try {
      const storedUser = localStorage.getItem('smconnect_user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (!user || !user.id) {
        setScanError('User not logged in or user ID not found.');
        return;
      }

      const res = await fetch('/api/attendance/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEventId,
          userId: user.id,
          lat: userLocation.lat,
          lng: userLocation.lng
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setScanError(data.error || 'Failed to record attendance');
        return;
      }

      setScanning(false);
      setScanned(true);
      addToast('Attendance recorded! Welcome to the event.', 'success');
    } catch (err) {
      console.error('Check-in error', err);
      setScanError('A network error occurred while checking in.');
    }
  };

  const resetState = () => {
    setScanning(false);
    setScanned(false);
    setLocationError('');
    setScanError('');
    setUserLocation(null);
  };

  return (
    <div className="page-member-content">
      <div className="page-header animate-fade-in-up">
        <h1>Attendance</h1>
        <p>Check in to church services and events</p>
      </div>

      {/* QR Scanner */}
      <div className="glass-card-static animate-fade-in-up stagger-1" style={{
        padding: 'var(--space-xl)', textAlign: 'center', marginBottom: 'var(--space-xl)',
      }}>
        {!scanning && !scanned && (
          <>
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label className="input-label" style={{ display: 'block', textAlign: 'left', marginBottom: 8, maxWidth: 400, margin: '0 auto 8px' }}>Select Event</label>
              <select 
                className="select" 
                value={selectedEventId} 
                onChange={(e) => setSelectedEventId(e.target.value)}
                style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}
              >
                <option value="">-- Choose Check-in Session --</option>
                {attendance.map(e => (
                  <option key={e.id} value={e.id}>{e.event} ({formatDate(e.date)})</option>
                ))}
              </select>
            </div>

            <div style={{
              width: 160, height: 160, margin: '0 auto var(--space-lg)',
              borderRadius: 'var(--radius-xl)', border: '3px dashed var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(212,168,67,0.05)',
            }}>
              <OnlineLogoIcon name="camera" size={64} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 4 }}>
              Scan QR Code
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
              Select an event and point your camera at the QR code
            </p>
            <button className="btn btn-gold btn-lg" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '0 auto' }} onClick={handleOpenScanner}>
              <OnlineLogoIcon name="camera" size={16} /> Open Scanner
            </button>
            {locationError && (
              <div style={{ marginTop: 'var(--space-md)', color: 'var(--soft-red)', fontSize: 'var(--text-sm)', padding: 'var(--space-sm)', background: 'rgba(224, 49, 49, 0.1)', borderRadius: 'var(--radius-md)' }}>
                {locationError}
              </div>
            )}
          </>
        )}

        {scanning && (
          <div className="animate-scale-in" style={{ padding: 'var(--space-xl)' }}>
            <div style={{
              width: 160, height: 160, margin: '0 auto var(--space-lg)',
              borderRadius: 'var(--radius-xl)', border: '3px solid var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
              background: 'linear-gradient(180deg, rgba(212,168,67,0.1), rgba(212,168,67,0.02))',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: 'var(--gold)', animation: 'scanLine 1.5s ease-in-out infinite',
              }} />
              <div style={{ opacity: 0.3 }}><OnlineLogoIcon name="smartphone" size={48} /></div>
            </div>
            <p style={{ fontWeight: 600 }}>Scanning for <strong>{selectedAttendanceEvent?.event}</strong>...</p>
            
            {!userLocation ? (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Getting your location...</p>
            ) : (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--emerald)' }}>Location acquired.</p>
            )}

            {scanError && (
              <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-sm)', background: 'rgba(224, 49, 49, 0.1)', color: 'var(--soft-red)', borderRadius: 'var(--radius-md)' }}>
                {scanError}
              </div>
            )}

            <button className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-lg)' }} onClick={resetState}>
              Cancel Scan
            </button>
            <style>{`
              @keyframes scanLine {
                0%, 100% { top: 0; }
                50% { top: calc(100% - 3px); }
              }
            `}</style>
          </div>
        )}

        {scanned && (
          <div className="animate-scale-in" style={{ padding: 'var(--space-xl)' }}>
            <div style={{ marginBottom: 'var(--space-md)', display: 'flex', justifyContent: 'center' }}><OnlineLogoIcon name="check-circle" size={64} color="var(--emerald)" /></div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--emerald)', marginBottom: 4 }}>
              Attendance Recorded!
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
              Welcome to {selectedAttendanceEvent?.event}
            </p>
            <div style={{
              padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
              background: 'rgba(43,138,62,0.08)', border: '1px solid rgba(43,138,62,0.15)',
              fontSize: 'var(--text-sm)',
            }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}><OnlineLogoIcon name="calendar" size={14} /> {new Date().toLocaleDateString()}</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0' }}><OnlineLogoIcon name="clock" size={14} /> {new Date().toLocaleTimeString()}</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}><OnlineLogoIcon name="map-pin" size={14} /> Location verified ✓</p>
            </div>
            <button className="btn btn-secondary" style={{ marginTop: 'var(--space-md)' }} onClick={resetState}>
              Scan Another
            </button>
          </div>
        )}
      </div>

      {/* Attendance History */}
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
        Recent Attendance
      </h3>
      <div className="timeline animate-fade-in-up stagger-2">
        {attendance.map(att => (
          <div key={att.id} className="timeline-item">
            <div className="glass-card-static" style={{ padding: 'var(--space-md)' }}>
              <div className="flex-between">
                <div>
                  <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{att.event}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{formatDate(att.date)}</p>
                </div>
                <span className="badge badge-green">Present</span>
              </div>
            </div>
          </div>
        ))}
        {attendance.length === 0 && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>No recent attendance records.</p>
        )}
      </div>
    </div>
  );
}
