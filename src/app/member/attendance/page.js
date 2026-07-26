'use client';
import { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatDate } from '@/lib/utils';
import { OnlineLogoIcon } from '@/components/icons';

export default function AttendancePage() {
  const { attendance, addToast } = useApp();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      addToast('Attendance recorded! Welcome to Sunday Service.', 'success');
    }, 2500);
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
              Point your camera at the event QR code to check in
            </p>
            <button className="btn btn-gold btn-lg" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={handleScan}>
              <OnlineLogoIcon name="camera" size={16} /> Open Scanner
            </button>
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
            <p style={{ fontWeight: 600 }}>Scanning...</p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Verifying QR code and location</p>
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
              Welcome to Sunday Worship Service
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
            <button className="btn btn-secondary" style={{ marginTop: 'var(--space-md)' }} onClick={() => setScanned(false)}>
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
      </div>
    </div>
  );
}
