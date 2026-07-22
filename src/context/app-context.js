'use client';
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  DEMO_MEMBERS, DEMO_CONTRIBUTIONS, DEMO_CAMPAIGNS,
  DEMO_CONTRIBUTION_TYPES, DEMO_EVENTS, DEMO_ANNOUNCEMENTS, DEMO_MESSAGES,
  DEMO_ATTENDANCE,
} from '@/lib/demo-data';

const AppContext = createContext(null);

let _nextId = 100;
const genId = (prefix = '') => `${prefix}${_nextId++}`;

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [members, setMembers] = useState(DEMO_MEMBERS);
  const [contributions, setContributions] = useState(DEMO_CONTRIBUTIONS);
  const [campaigns, setCampaigns] = useState(DEMO_CAMPAIGNS);
  const [contributionTypes, setContributionTypes] = useState(DEMO_CONTRIBUTION_TYPES);
  const [events, setEvents] = useState(DEMO_EVENTS);
  const [announcements, setAnnouncements] = useState(DEMO_ANNOUNCEMENTS);
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [attendance, setAttendance] = useState(DEMO_ATTENDANCE);
  const [toasts, setToasts] = useState([]);

  // ── Auth ─────────────────────────────────────────────
  const login = useCallback((email, password) => {
    if (email === 'admin@smconnect.org' && password === 'admin123') {
      setUser({ id: '0', name: 'Super Admin', email, role: 'admin', photo: null });
      return { success: true, role: 'admin' };
    }
    const member = members.find(m => m.email === email && m.status === 'approved');
    if (member) {
      setUser({ ...member, role: 'member' });
      return { success: true, role: 'member' };
    }
    return { success: false, error: 'Invalid credentials or account not approved.' };
  }, [members]);

  const logout = useCallback(() => setUser(null), []);

  // ── Theme ───────────────────────────────────────────
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  // ── Toasts ──────────────────────────────────────────
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  // ── Members CRUD ────────────────────────────────────
  const addMember = useCallback((data) => {
    const newMember = {
      id: genId('m'), ...data,
      status: 'pending', joinedDate: new Date().toISOString().split('T')[0],
      lastLogin: null, photo: null,
    };
    setMembers(prev => [newMember, ...prev]);
    addToast(`Member "${data.name}" added successfully`, 'success');
    return newMember;
  }, [addToast]);

  const updateMember = useCallback((id, data) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
    addToast('Member updated successfully', 'success');
  }, [addToast]);

  const deleteMember = useCallback((id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    addToast('Member removed', 'warning');
  }, [addToast]);

  const approveMember = useCallback((id) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: 'approved' } : m));
    addToast('Member approved successfully', 'success');
  }, [addToast]);

  const rejectMember = useCallback((id) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: 'rejected' } : m));
    addToast('Member rejected', 'warning');
  }, [addToast]);

  // ── Contributions CRUD ──────────────────────────────
  const addContribution = useCallback((data) => {
    const newContrib = {
      id: genId('c'), ...data,
      status: 'pending', date: new Date().toISOString().split('T')[0],
      reference: `MTN-${Date.now().toString().slice(-10)}`,
    };
    setContributions(prev => [newContrib, ...prev]);
    addToast('Contribution submitted! Pending approval.', 'success');
    return newContrib;
  }, [addToast]);

  const updateContribution = useCallback((id, data) => {
    setContributions(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    addToast('Contribution updated', 'success');
  }, [addToast]);

  const deleteContribution = useCallback((id) => {
    setContributions(prev => prev.filter(c => c.id !== id));
    addToast('Contribution deleted', 'warning');
  }, [addToast]);

  const approveContribution = useCallback((id) => {
    setContributions(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
    addToast('Contribution approved! Receipt sent.', 'success');
  }, [addToast]);

  const rejectContribution = useCallback((id) => {
    setContributions(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
    addToast('Contribution rejected', 'warning');
  }, [addToast]);

  // ── Campaigns CRUD ──────────────────────────────────
  const addCampaign = useCallback((data) => {
    const newCamp = {
      id: genId('camp'), ...data,
      raised: 0, contributors: 0, status: 'active',
    };
    setCampaigns(prev => [newCamp, ...prev]);
    addToast(`Campaign "${data.title}" created`, 'success');
    return newCamp;
  }, [addToast]);

  const updateCampaign = useCallback((id, data) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    addToast('Campaign updated', 'success');
  }, [addToast]);

  const deleteCampaign = useCallback((id) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    addToast('Campaign deleted', 'warning');
  }, [addToast]);

  // ── Events CRUD ─────────────────────────────────────
  const addEvent = useCallback((data) => {
    const newEvent = { id: genId('e'), ...data };
    setEvents(prev => [newEvent, ...prev]);
    addToast(`Event "${data.title}" created`, 'success');
    return newEvent;
  }, [addToast]);

  const updateEvent = useCallback((id, data) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    addToast('Event updated', 'success');
  }, [addToast]);

  const deleteEvent = useCallback((id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    addToast('Event deleted', 'warning');
  }, [addToast]);

  // ── Announcements CRUD ──────────────────────────────
  const addAnnouncement = useCallback((data) => {
    const newAnn = {
      id: genId('a'), ...data,
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    addToast(`Announcement "${data.title}" published`, 'success');
    return newAnn;
  }, [addToast]);

  const updateAnnouncement = useCallback((id, data) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    addToast('Announcement updated', 'success');
  }, [addToast]);

  const deleteAnnouncement = useCallback((id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    addToast('Announcement deleted', 'warning');
  }, [addToast]);

  // ── Messages CRUD ───────────────────────────────────
  const addMessage = useCallback((data) => {
    const newMsg = {
      id: genId('msg'), ...data,
      date: new Date().toISOString().split('T')[0], unread: true,
    };
    setMessages(prev => [newMsg, ...prev]);
    return newMsg;
  }, []);

  const deleteMessage = useCallback((id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    addToast('Message deleted', 'warning');
  }, [addToast]);

  const markMessageRead = useCallback((id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, unread: false } : m));
  }, []);

  // ── Contribution Types CRUD ─────────────────────────
  const addContributionType = useCallback((data) => {
    const newCT = { id: genId('ct'), ...data, active: true };
    setContributionTypes(prev => [newCT, ...prev]);
    addToast(`Contribution type "${data.name}" created`, 'success');
    return newCT;
  }, [addToast]);

  const updateContributionType = useCallback((id, data) => {
    setContributionTypes(prev => prev.map(ct => ct.id === id ? { ...ct, ...data } : ct));
    addToast('Contribution type updated', 'success');
  }, [addToast]);

  const deleteContributionType = useCallback((id) => {
    setContributionTypes(prev => prev.filter(ct => ct.id !== id));
    addToast('Contribution type deleted', 'warning');
  }, [addToast]);

  // ── Attendance CRUD ─────────────────────────────────
  const addAttendance = useCallback((data) => {
    const newAtt = {
      id: genId('att'), ...data,
      total: Number(data.total) || 0,
      capacity: Number(data.capacity) || 100,
    };
    setAttendance(prev => [newAtt, ...prev]);
    addToast(`Attendance session "${data.event}" recorded`, 'success');
    return newAtt;
  }, [addToast]);

  const updateAttendance = useCallback((id, data) => {
    setAttendance(prev => prev.map(a => a.id === id ? { ...a, ...data, total: Number(data.total) || a.total, capacity: Number(data.capacity) || a.capacity } : a));
    addToast('Attendance session updated', 'success');
  }, [addToast]);

  const deleteAttendance = useCallback((id) => {
    setAttendance(prev => prev.filter(a => a.id !== id));
    addToast('Attendance session deleted', 'warning');
  }, [addToast]);

  // ── Computed Stats ──────────────────────────────────
  const stats = useMemo(() => ({
    totalMembers: members.length,
    approvedMembers: members.filter(m => m.status === 'approved').length,
    pendingMembers: members.filter(m => m.status === 'pending').length,
    totalContributions: contributions.filter(c => c.status === 'approved').length,
    pendingContributions: contributions.filter(c => c.status === 'pending').length,
    monthlyRWF: contributions.filter(c => c.status === 'approved' && c.currency === 'RWF').reduce((s, c) => s + c.amount, 0),
    monthlyUSD: contributions.filter(c => c.status === 'approved' && c.currency === 'USD').reduce((s, c) => s + c.amount, 0),
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    localMembers: members.filter(m => m.type === 'local').length,
    diasporaMembers: members.filter(m => m.type === 'diaspora').length,
    studentMembers: members.filter(m => m.employment === 'student').length,
    employedMembers: members.filter(m => m.employment === 'employed').length,
  }), [members, contributions, campaigns]);

  return (
    <AppContext.Provider value={{
      user, login, logout,
      theme, toggleTheme,
      language, setLanguage,
      sidebarOpen, setSidebarOpen,
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
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
