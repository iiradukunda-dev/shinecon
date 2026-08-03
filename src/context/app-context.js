'use client';
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('smconnect_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          const FIFTEEN_DAYS = 15 * 24 * 60 * 60 * 1000;
          
          if (parsedUser.lastActive && (Date.now() - parsedUser.lastActive < FIFTEEN_DAYS)) {
            // Session is valid, update lastActive
            parsedUser.lastActive = Date.now();
            localStorage.setItem('smconnect_user', JSON.stringify(parsedUser));
            setUser(parsedUser);
          } else {
            // Session expired due to inactivity
            localStorage.removeItem('smconnect_user');
            setUser(null);
            console.log('Session expired due to inactivity.');
          }
        } catch (e) {
          console.error('Failed to parse saved user state', e);
        }
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    
    let lastUpdate = Date.now();
    const updateActivity = () => {
      const now = Date.now();
      if (now - lastUpdate > 60000) { // Update at most once every 60s
        lastUpdate = now;
        const saved = localStorage.getItem('smconnect_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            parsed.lastActive = now;
            localStorage.setItem('smconnect_user', JSON.stringify(parsed));
          } catch(e) {
            // Ignore parse errors here
          }
        }
      }
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, [user]);


  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [members, setMembers] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [contributionTypes, setContributionTypes] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // ── Toasts ──────────────────────────────────────────
  const addToast = useCallback((payload, type = 'info') => {
    const id = Date.now().toString();
    const title = typeof payload === 'string' ? (type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Notice') : payload.title;
    const message = typeof payload === 'string' ? payload : payload.message;
    setToasts(prev => [...prev, { id, message, title, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  // Network offline/online notifications
  useEffect(() => {
    const handleOffline = () => {
      addToast('You are currently offline. Please check your internet connection.', 'error');
    };
    const handleOnline = () => {
      addToast('You are back online.', 'success');
    };
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    // Check initial state
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      handleOffline();
    }
    
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [addToast]);

  // ── Bootstrap (Load all data from DB) ─────────────────
  const bootstrap = useCallback(async (silent = false) => {
    try {
      const res = await fetch('/api/bootstrap?_t=' + Date.now(), { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.members) setMembers(data.members);
        if (data.contributions) setContributions(data.contributions);
        if (data.campaigns) setCampaigns(data.campaigns);
        if (data.contributionTypes) setContributionTypes(data.contributionTypes);
        if (data.events) setEvents(data.events);
        if (data.announcements) setAnnouncements(data.announcements);
        if (data.messages) setMessages(data.messages);
        if (data.attendance) setAttendance(data.attendance);
        if (data.notifications) setNotifications(data.notifications);
      } else if (!silent) {
        addToast('Failed to connect to database. Running in offline/fallback mode.', 'warning');
      }
    } catch (error) {
      if (!silent) console.error('Failed to load database entries:', error);
    }
  }, [addToast]);

  useEffect(() => {
    bootstrap(false);
    const interval = setInterval(() => {
      bootstrap(true);
    }, 60000); // Poll every 60 seconds instead of 10s
    return () => clearInterval(interval);
  }, [bootstrap]);

  // ── Auth ─────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const userWithSession = { ...data.user, lastActive: Date.now() };
        setUser(userWithSession);
        if (typeof window !== 'undefined') {
          localStorage.setItem('smconnect_user', JSON.stringify(userWithSession));
        }
        return { success: true, role: data.role };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Database connection failed' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('smconnect_user');
    }
  }, []);

  const updateUser = useCallback((newData) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...newData };
      if (typeof window !== 'undefined') {
        localStorage.setItem('smconnect_user', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // ── Theme ───────────────────────────────────────────
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  // ── Members CRUD ────────────────────────────────────
  const addMember = useCallback(async (data) => {
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newMember = await res.json();
        setMembers(prev => [newMember, ...prev]);
        addToast(`Member "${data.name}" registered successfully`, 'success');
        return newMember;
      } else {
        const err = await res.json();
        addToast(err.error || 'Failed to add member', 'error');
      }
    } catch (error) {
      console.error('Member add error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  const updateMember = useCallback(async (id, data) => {
    try {
      const res = await fetch('/api/members', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));
        addToast('Member updated successfully', 'success');
      } else {
        addToast('Failed to update member', 'error');
      }
    } catch (error) {
      console.error('Member update error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  const deleteMember = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/members?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMembers(prev => prev.filter(m => m.id !== id));
        addToast('Member removed', 'warning');
      } else {
        addToast('Failed to delete member', 'error');
      }
    } catch (error) {
      console.error('Member delete error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  const approveMember = useCallback((id) => {
    updateMember(id, { status: 'approved' });
  }, [updateMember]);

  const rejectMember = useCallback((id) => {
    updateMember(id, { status: 'rejected' });
  }, [updateMember]);

  // ── Contributions CRUD ──────────────────────────────
  const addContribution = useCallback(async (data) => {
    try {
      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newContrib = await res.json();
        setContributions(prev => [newContrib, ...prev]);
        addToast('Contribution submitted! Pending approval.', 'success');
        return newContrib;
      } else {
        addToast('Failed to submit contribution', 'error');
      }
    } catch (error) {
      console.error('Contribution submit error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  const updateContribution = useCallback(async (id, data) => {
    try {
      const res = await fetch('/api/contributions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      if (res.ok) {
        const updated = await res.json();
        setContributions(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
        addToast('Contribution updated', 'success');
      } else {
        addToast('Failed to update contribution', 'error');
      }
    } catch (error) {
      console.error('Contribution update error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  const deleteContribution = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/contributions?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setContributions(prev => prev.filter(c => c.id !== id));
        addToast('Contribution deleted', 'warning');
      } else {
        addToast('Failed to delete contribution', 'error');
      }
    } catch (error) {
      console.error('Contribution delete error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  const approveContribution = useCallback((id) => {
    updateContribution(id, { status: 'approved' });
  }, [updateContribution]);

  const rejectContribution = useCallback((id) => {
    updateContribution(id, { status: 'rejected' });
  }, [updateContribution]);

  // ── Campaigns CRUD ──────────────────────────────────
  const addCampaign = useCallback(async (data) => {
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newCamp = await res.json();
        setCampaigns(prev => [newCamp, ...prev]);
        addToast(`Campaign "${data.title}" created`, 'success');
        return newCamp;
      } else {
        addToast('Failed to create campaign', 'error');
      }
    } catch (error) {
      console.error('Campaign create error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  const updateCampaign = useCallback(async (id, data) => {
    try {
      const res = await fetch('/api/campaigns', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
        addToast('Campaign updated', 'success');
      } else {
        addToast('Failed to update campaign', 'error');
      }
    } catch (error) {
      console.error('Campaign update error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  const deleteCampaign = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/campaigns?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCampaigns(prev => prev.filter(c => c.id !== id));
        addToast('Campaign deleted', 'warning');
      } else {
        addToast('Failed to delete campaign', 'error');
      }
    } catch (error) {
      console.error('Campaign delete error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  // ── Events CRUD ─────────────────────────────────────
  const addEvent = useCallback(async (data) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newEvent = await res.json();
        setEvents(prev => [newEvent, ...prev]);
        addToast(`Event "${data.title}" created`, 'success');
        return newEvent;
      } else {
        addToast('Failed to create event', 'error');
      }
    } catch (error) {
      console.error('Event create error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  const updateEvent = useCallback(async (id, data) => {
    try {
      const res = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      if (res.ok) {
        const updated = await res.json();
        setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
        addToast('Event updated', 'success');
      } else {
        addToast('Failed to update event', 'error');
      }
    } catch (error) {
      console.error('Event update error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  const deleteEvent = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents(prev => prev.filter(e => e.id !== id));
        addToast('Event deleted', 'warning');
      } else {
        addToast('Failed to delete event', 'error');
      }
    } catch (error) {
      console.error('Event delete error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  // ── Announcements CRUD ──────────────────────────────
  const addAnnouncement = useCallback(async (data) => {
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newAnn = await res.json();
        setAnnouncements(prev => [newAnn, ...prev]);
        addToast(`Announcement "${data.title}" published`, 'success');
        return newAnn;
      } else {
        addToast('Failed to publish announcement', 'error');
      }
    } catch (error) {
      console.error('Announcement publish error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  const updateAnnouncement = useCallback(async (id, data) => {
    try {
      const res = await fetch('/api/announcements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      if (res.ok) {
        const updated = await res.json();
        setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
        addToast('Announcement updated', 'success');
      } else {
        addToast('Failed to update announcement', 'error');
      }
    } catch (error) {
      console.error('Announcement update error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  const deleteAnnouncement = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
        addToast('Announcement deleted', 'warning');
      } else {
        addToast('Failed to delete announcement', 'error');
      }
    } catch (error) {
      console.error('Announcement delete error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  // ── Messages CRUD ───────────────────────────────────
  const addMessage = useCallback(async (data) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newMsg = await res.json();
        setMessages(prev => [newMsg, ...prev]);
        return newMsg;
      }
    } catch (error) {
      console.error('Message send error:', error);
    }
  }, []);

  const deleteMessage = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
        addToast('Message deleted', 'warning');
      } else {
        addToast('Failed to delete message', 'error');
      }
    } catch (error) {
      console.error('Message delete error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  const markMessageRead = useCallback(async (id) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, unread: false }),
      });
      if (res.ok) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, unread: false } : m));
      }
    } catch (error) {
      console.error('Message read mark error:', error);
    }
  }, []);

  // ── Contribution Types CRUD ─────────────────────────
  const addContributionType = useCallback(async (data) => {
    try {
      const res = await fetch('/api/contribution-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newCT = await res.json();
        setContributionTypes(prev => [newCT, ...prev]);
        addToast(`Contribution type "${data.name}" created`, 'success');
        return newCT;
      }
    } catch (error) {
      console.error('Contribution type create error:', error);
    }
  }, [addToast]);

  const updateContributionType = useCallback(async (id, data) => {
    try {
      const res = await fetch('/api/contribution-types', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      if (res.ok) {
        const updated = await res.json();
        setContributionTypes(prev => prev.map(ct => ct.id === id ? { ...ct, ...updated } : ct));
        addToast('Contribution type updated', 'success');
      }
    } catch (error) {
      console.error('Contribution type update error:', error);
    }
  }, [addToast]);

  const deleteContributionType = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/contribution-types?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setContributionTypes(prev => prev.filter(ct => ct.id !== id));
        addToast('Contribution type deleted', 'warning');
      }
    } catch (error) {
      console.error('Contribution type delete error:', error);
    }
  }, [addToast]);

  // ── Attendance CRUD ─────────────────────────────────
  const addAttendance = useCallback(async (data) => {
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newAtt = await res.json();
        setAttendance(prev => [newAtt, ...prev]);
        addToast(`Attendance session "${data.event}" recorded`, 'success');
        return newAtt;
      } else {
        addToast('Failed to record attendance', 'error');
      }
    } catch (error) {
      console.error('Attendance add error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  const updateAttendance = useCallback(async (id, data) => {
    try {
      const res = await fetch('/api/attendance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      if (res.ok) {
        const updated = await res.json();
        setAttendance(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
        addToast('Attendance session updated', 'success');
      } else {
        addToast('Failed to update attendance', 'error');
      }
    } catch (error) {
      console.error('Attendance update error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  const deleteAttendance = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/attendance?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAttendance(prev => prev.filter(a => a.id !== id));
        addToast('Attendance session deleted', 'warning');
      } else {
        addToast('Failed to delete attendance', 'error');
      }
    } catch (error) {
      console.error('Attendance delete error:', error);
      addToast('Database connection error', 'error');
    }
  }, [addToast]);

  // ── Computed Stats ──────────────────────────────────
  const stats = useMemo(() => ({
    totalMembers: members.length,
    approvedMembers: members.filter(m => m.status === 'approved').length,
    pendingMembers: members.filter(m => m.status === 'pending').length,
    totalContributions: contributions.filter(c => c.status === 'approved').length,
    pendingContributions: contributions.filter(c => c.status === 'pending').length,
    monthlyRWF: contributions.filter(c => c.status === 'approved' && c.currency === 'RWF').reduce((s, c) => s + c.amount, 0),
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    localMembers: members.filter(m => m.type === 'local').length,
    diasporaMembers: members.filter(m => m.type === 'diaspora').length,
    studentMembers: members.filter(m => m.employment === 'student').length,
    employedMembers: members.filter(m => m.employment === 'employed').length,
  }), [members, contributions, campaigns]);

  const contextValue = useMemo(() => ({
    user, isInitialized, login, logout, updateUser,
    theme, toggleTheme,
    language, setLanguage,
    sidebarOpen, setSidebarOpen,
    notifications, setNotifications,
    // Members
    members, addMember, updateMember, deleteMember, approveMember, rejectMember,
    // Contributions
    contributions, addContribution, updateContribution, deleteContribution,
    approveContribution, rejectContribution,
    // Campaigns
    campaigns, addCampaign, updateCampaign, deleteCampaign,
    // Events
    events, addEvent, updateEvent, deleteEvent,
    // Announcements
    announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
    // Messages
    messages, addMessage, deleteMessage, markMessageRead,
    // Contribution Types
    contributionTypes, addContributionType, updateContributionType, deleteContributionType,
    // Attendance
    attendance, addAttendance, updateAttendance, deleteAttendance,
    // Stats & UI
    stats, toasts, addToast,
  }), [
    user, isInitialized, login, logout, theme, toggleTheme, language, setLanguage,
    sidebarOpen, setSidebarOpen, members, addMember, updateMember, deleteMember,
    approveMember, rejectMember, contributions, addContribution, updateContribution,
    deleteContribution, approveContribution, rejectContribution, campaigns, addCampaign,
    updateCampaign, deleteCampaign, events, addEvent, updateEvent, deleteEvent,
    announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, messages,
    addMessage, deleteMessage, markMessageRead, contributionTypes, addContributionType,
    updateContributionType, deleteContributionType, attendance, addAttendance,
    updateAttendance, deleteAttendance, stats, toasts, addToast
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
