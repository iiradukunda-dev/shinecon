'use client';
import { useState, useCallback, useEffect } from 'react';

export function useUI() {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [settings, setSettings] = useState({});

  const addToast = useCallback((payload, type = 'info') => {
    const id = Date.now().toString();
    const title =
      typeof payload === 'string'
        ? type === 'error'
          ? 'Error'
          : type === 'success'
            ? 'Success'
            : 'Notice'
        : payload.title;
    const message = typeof payload === 'string' ? payload : payload.message;
    setToasts((prev) => [...prev, { id, message, title, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  useEffect(() => {
    const handleOffline = () => {
      addToast('You are currently offline. Please check your internet connection.', 'error');
    };
    const handleOnline = () => {
      addToast('You are back online.', 'success');
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [addToast]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  const updateGlobalSettings = useCallback((newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return {
    theme,
    toggleTheme,
    language,
    setLanguage,
    sidebarOpen,
    setSidebarOpen,
    toasts,
    addToast,
    settings,
    setSettings,
    updateGlobalSettings,
  };
}
