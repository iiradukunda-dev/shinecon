'use client';
import { useApp } from '@/context/app-context';
import { OnlineLogoIcon } from '@/components/icons';

export default function GlobalToasts() {
  const { toasts } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" style={{ zIndex: 9999 }}>
      {toasts.map(t => (
        <div key={t.id} className="toast" style={{
          borderLeft: `4px solid ${t.type === 'success' ? 'var(--emerald)' : t.type === 'error' ? 'var(--soft-red)' : 'var(--gold)'}`,
          backgroundColor: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
        }}>
          {t.type === 'success' ? (
            <OnlineLogoIcon name="check-circle" size={16} color="var(--emerald)" />
          ) : t.type === 'error' ? (
            <OnlineLogoIcon name="x-circle" size={16} color="var(--soft-red)" />
          ) : (
            <OnlineLogoIcon name="info" size={16} color="var(--gold)" />
          )} 
          <span style={{ marginLeft: 8 }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
