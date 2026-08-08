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
          setUser(JSON.parse(savedUser));
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
    (email, password) => {
      // Mock login
      if (email && password) {
        const newUser = {
          id: '1',
          name: 'Admin User',
          email,
          role: 'admin',
          avatar: 'https://i.pravatar.cc/150?u=admin',
        };
        setUser(newUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('smconnect_user', JSON.stringify(newUser));
        }
        addToast('Logged in successfully', 'success');
        return true;
      }
      return false;
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
    login,
    logout,
    churchInfo,
    setChurchInfo,
    updateChurchInfo,
  };
}
