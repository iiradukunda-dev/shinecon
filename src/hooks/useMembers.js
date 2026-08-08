'use client';
import { useState, useCallback } from 'react';

export function useMembers(addToast) {
  const [members, setMembers] = useState([]);

  const addMember = useCallback(
    async (data) => {
      try {
        const res = await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const newMember = await res.json();
          setMembers((prev) => [newMember, ...prev]);
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
    },
    [addToast]
  );

  const updateMember = useCallback(
    async (id, data) => {
      try {
        const res = await fetch('/api/members', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...data }),
        });
        if (res.ok) {
          const updated = await res.json();
          setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
          addToast('Member updated successfully', 'success');
        } else {
          addToast('Failed to update member', 'error');
        }
      } catch (error) {
        console.error('Member update error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

  const deleteMember = useCallback(
    async (id) => {
      try {
        const res = await fetch(`/api/members?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setMembers((prev) => prev.filter((m) => m.id !== id));
          addToast('Member removed', 'warning');
        } else {
          addToast('Failed to delete member', 'error');
        }
      } catch (error) {
        console.error('Member delete error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

  const approveMember = useCallback(
    (id) => {
      updateMember(id, { status: 'approved' });
    },
    [updateMember]
  );

  const rejectMember = useCallback(
    (id) => {
      updateMember(id, { status: 'rejected' });
    },
    [updateMember]
  );

  return {
    members,
    setMembers,
    addMember,
    updateMember,
    deleteMember,
    approveMember,
    rejectMember,
  };
}
