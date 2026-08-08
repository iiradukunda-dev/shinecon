'use client';
import { useState, useCallback } from 'react';

export function useCommunications(addToast) {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // ── Events CRUD ─────────────────────────────────────
  const addEvent = useCallback(
    async (data) => {
      try {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const newEvent = await res.json();
          setEvents((prev) => [newEvent, ...prev]);
          addToast(`Event "${data.title}" created`, 'success');
          return newEvent;
        } else {
          addToast('Failed to create event', 'error');
        }
      } catch (error) {
        console.error('Event create error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

  const updateEvent = useCallback(
    async (id, data) => {
      try {
        const res = await fetch('/api/events', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...data }),
        });
        if (res.ok) {
          const updated = await res.json();
          setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
          addToast('Event updated', 'success');
        } else {
          addToast('Failed to update event', 'error');
        }
      } catch (error) {
        console.error('Event update error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

  const deleteEvent = useCallback(
    async (id) => {
      try {
        const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setEvents((prev) => prev.filter((e) => e.id !== id));
          addToast('Event deleted', 'warning');
        } else {
          addToast('Failed to delete event', 'error');
        }
      } catch (error) {
        console.error('Event delete error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

  // ── Announcements CRUD ──────────────────────────────
  const addAnnouncement = useCallback(
    async (data) => {
      try {
        const res = await fetch('/api/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const newAnn = await res.json();
          setAnnouncements((prev) => [newAnn, ...prev]);
          addToast(`Announcement "${data.title}" published`, 'success');
          return newAnn;
        } else {
          addToast('Failed to publish announcement', 'error');
        }
      } catch (error) {
        console.error('Announcement publish error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

  const updateAnnouncement = useCallback(
    async (id, data) => {
      try {
        const res = await fetch('/api/announcements', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...data }),
        });
        if (res.ok) {
          const updated = await res.json();
          setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
          addToast('Announcement updated', 'success');
        } else {
          addToast('Failed to update announcement', 'error');
        }
      } catch (error) {
        console.error('Announcement update error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

  const deleteAnnouncement = useCallback(
    async (id) => {
      try {
        const res = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setAnnouncements((prev) => prev.filter((a) => a.id !== id));
          addToast('Announcement deleted', 'warning');
        } else {
          addToast('Failed to delete announcement', 'error');
        }
      } catch (error) {
        console.error('Announcement delete error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

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
        setMessages((prev) => [newMsg, ...prev]);
        return newMsg;
      }
    } catch (error) {
      console.error('Message send error:', error);
    }
  }, []);

  const deleteMessage = useCallback(
    async (id) => {
      try {
        const res = await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setMessages((prev) => prev.filter((m) => m.id !== id));
          addToast('Message deleted', 'warning');
        } else {
          addToast('Failed to delete message', 'error');
        }
      } catch (error) {
        console.error('Message delete error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

  const markMessageRead = useCallback(async (id) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, unread: false }),
      });
      if (res.ok) {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)));
      }
    } catch (error) {
      console.error('Message read mark error:', error);
    }
  }, []);

  // ── Attendance CRUD ─────────────────────────────────
  const addAttendance = useCallback(
    async (data) => {
      try {
        const res = await fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const newAtt = await res.json();
          setAttendance((prev) => [newAtt, ...prev]);
          addToast(`Attendance session "${data.event}" recorded`, 'success');
          return newAtt;
        } else {
          addToast('Failed to record attendance', 'error');
        }
      } catch (error) {
        console.error('Attendance add error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

  const updateAttendance = useCallback(
    async (id, data) => {
      try {
        const res = await fetch('/api/attendance', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...data }),
        });
        if (res.ok) {
          const updated = await res.json();
          setAttendance((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
          addToast('Attendance session updated', 'success');
        } else {
          addToast('Failed to update attendance', 'error');
        }
      } catch (error) {
        console.error('Attendance update error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

  const deleteAttendance = useCallback(
    async (id) => {
      try {
        const res = await fetch(`/api/attendance?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setAttendance((prev) => prev.filter((a) => a.id !== id));
          addToast('Attendance session deleted', 'warning');
        } else {
          addToast('Failed to delete attendance', 'error');
        }
      } catch (error) {
        console.error('Attendance delete error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

  return {
    events,
    setEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    announcements,
    setAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    messages,
    setMessages,
    addMessage,
    deleteMessage,
    markMessageRead,
    attendance,
    setAttendance,
    addAttendance,
    updateAttendance,
    deleteAttendance,
    notifications,
    setNotifications,
  };
}
