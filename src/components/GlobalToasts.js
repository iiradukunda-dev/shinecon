'use client';
import { useApp } from '@/context/app-context';
import { OnlineLogoIcon } from '@/components/icons';

export default function GlobalToasts() {
  const { toasts } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" style={{ zIndex: 9999 }}>
      {toasts.map((t) => {
        if (t.type === 'error') {
          return (
            <div
              key={t.id}
              className="toast"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#0c0c10',
                border: '1px solid rgba(220, 38, 38, 0.4)',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: "none",
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <OnlineLogoIcon name="shield-x" size={26} color="ef4444" />
                </div>
                <div
                  style={{
                    width: '1px',
                    height: '32px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    margin: '0 16px',
                  }}
                ></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#fff', fontSize: '15px', fontWeight: '600' }}>
                    {t.title}
                  </span>
                  <span
                    style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginTop: '2px' }}
                  >
                    {t.message}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}>
                <OnlineLogoIcon name="chevron-right" size={20} color="ef4444" />
              </div>
            </div>
          );
        }

        return (
          <div
            key={t.id}
            className="toast"
            style={{
              borderLeft: `4px solid ${t.type === 'success' ? 'var(--emerald)' : 'var(--gold)'}`,
              backgroundColor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {t.type === 'success' ? (
              <OnlineLogoIcon name="check-circle" size={16} color="var(--emerald)" />
            ) : (
              <OnlineLogoIcon name="info" size={16} color="var(--gold)" />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 8 }}>
              {t.title && t.title !== 'Notice' && t.title !== 'Success' && (
                <span style={{ fontWeight: '600', fontSize: '13px' }}>{t.title}</span>
              )}
              <span>{t.message}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
