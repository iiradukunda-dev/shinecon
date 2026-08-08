'use client';
import { useState, useCallback, useEffect } from 'react';

export function useAuth(addToast) {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('smconnect_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.id === '1' && parsed.name === 'Admin User') {
            localStorage.removeItem('smconnect_user');
            setUser(null);
          } else {
            setUser(parsed);
          }
        } catch (e) {
          console.error('Failed to parse saved user state', e);
        }
      }
    }
    setIsInitialized(true);
  }, []);

  const [churchInfo, setChurchInfo] = useState({
    name: 'Shine Community Church',
    logo: '/logo.png',
    primaryColor: '#D4A843',
  });

  const login = useCallback(
    async (email, password) => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        
        if (data.success) {
          setUser(data.user);
          if (typeof window !== 'undefined') {
            localStorage.setItem('smconnect_user', JSON.stringify(data.user));
          }
          addToast('Logged in successfully', 'success');
          return { success: true, role: data.role };
        } else {
          return { success: false, error: data.error };
        }
      } catch (err) {
        return { success: false, error: 'Network error' };
      }
    },
    [addToast]
  );

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('smconnect_user');
    }
    addToast('Logged out successfully', 'info');
  }, [addToast]);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem('smconnect_user', JSON.stringify(updatedUser));
      }
      return updatedUser;
    });
  }, []);

  const updateChurchInfo = useCallback(
    (info) => {
      setChurchInfo((prev) => ({ ...prev, ...info }));
      addToast('Church information updated', 'success');
    },
    [addToast]
  );

  return {
    user,
    isInitialized,
    setUser,
    updateUser,
    login,
    logout,
    churchInfo,
    setChurchInfo,
    updateChurchInfo,
  };
}
