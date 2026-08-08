'use client';
import { useState, useCallback } from 'react';

export function useAuth(addToast) {
  const [user, setUser] = useState({
    id: '1',
    name: 'Admin User',
    email: 'admin@shine.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
  });

  const [churchInfo, setChurchInfo] = useState({
    name: 'Shine Community Church',
    logo: '/logo.png',
    primaryColor: '#D4A843',
  });

  const login = useCallback(
    (email, password) => {
      // Mock login
      if (email && password) {
        setUser({
          id: '1',
          name: 'Admin User',
          email,
          role: 'admin',
          avatar: 'https://i.pravatar.cc/150?u=admin',
        });
        addToast('Logged in successfully', 'success');
        return true;
      }
      return false;
    },
    [addToast]
  );

  const logout = useCallback(() => {
    setUser(null);
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
    setUser,
    login,
    logout,
    churchInfo,
    setChurchInfo,
    updateChurchInfo,
  };
}
