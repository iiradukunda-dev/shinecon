'use client';
import { useState, useCallback } from 'react';

export function useFinance(addToast) {
  const [contributions, setContributions] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [contributionTypes, setContributionTypes] = useState([]);

  // ── Contributions CRUD ──────────────────────────────
  const addContribution = useCallback(
    async (data) => {
      try {
        const res = await fetch('/api/contributions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const newContrib = await res.json();
          setContributions((prev) => [newContrib, ...prev]);
          addToast('Contribution submitted! Pending approval.', 'success');
          return newContrib;
        } else {
          addToast('Failed to submit contribution', 'error');
        }
      } catch (error) {
        console.error('Contribution submit error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

  const updateContribution = useCallback(
    async (id, data) => {
      try {
        const res = await fetch('/api/contributions', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...data }),
        });
        if (res.ok) {
          const updated = await res.json();
          setContributions((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
          addToast('Contribution updated', 'success');
        } else {
          addToast('Failed to update contribution', 'error');
        }
      } catch (error) {
        console.error('Contribution update error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

  const deleteContribution = useCallback(
    async (id) => {
      try {
        const res = await fetch(`/api/contributions?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setContributions((prev) => prev.filter((c) => c.id !== id));
          addToast('Contribution deleted', 'warning');
        } else {
          addToast('Failed to delete contribution', 'error');
        }
      } catch (error) {
        console.error('Contribution delete error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

  const approveContribution = useCallback(
    (id) => {
      updateContribution(id, { status: 'approved' });
    },
    [updateContribution]
  );

  const rejectContribution = useCallback(
    (id) => {
      updateContribution(id, { status: 'rejected' });
    },
    [updateContribution]
  );

  // ── Campaigns CRUD ──────────────────────────────────
  const addCampaign = useCallback(
    async (data) => {
      try {
        const res = await fetch('/api/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const newCamp = await res.json();
          setCampaigns((prev) => [newCamp, ...prev]);
          addToast(`Campaign "${data.title}" created`, 'success');
          return newCamp;
        } else {
          addToast('Failed to create campaign', 'error');
        }
      } catch (error) {
        console.error('Campaign create error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

  const updateCampaign = useCallback(
    async (id, data) => {
      try {
        const res = await fetch('/api/campaigns', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...data }),
        });
        if (res.ok) {
          const updated = await res.json();
          setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
          addToast('Campaign updated', 'success');
        } else {
          addToast('Failed to update campaign', 'error');
        }
      } catch (error) {
        console.error('Campaign update error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

  const deleteCampaign = useCallback(
    async (id) => {
      try {
        const res = await fetch(`/api/campaigns?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setCampaigns((prev) => prev.filter((c) => c.id !== id));
          addToast('Campaign deleted', 'warning');
        } else {
          addToast('Failed to delete campaign', 'error');
        }
      } catch (error) {
        console.error('Campaign delete error:', error);
        addToast('Database connection error', 'error');
      }
    },
    [addToast]
  );

  // ── Contribution Types CRUD ─────────────────────────
  const addContributionType = useCallback(
    async (data) => {
      try {
        const res = await fetch('/api/contribution-types', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const newCT = await res.json();
          setContributionTypes((prev) => [newCT, ...prev]);
          addToast(`Contribution type "${data.name}" created`, 'success');
          return newCT;
        }
      } catch (error) {
        console.error('Contribution type create error:', error);
      }
    },
    [addToast]
  );

  const updateContributionType = useCallback(
    async (id, data) => {
      try {
        const res = await fetch('/api/contribution-types', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...data }),
        });
        if (res.ok) {
          const updated = await res.json();
          setContributionTypes((prev) =>
            prev.map((ct) => (ct.id === id ? { ...ct, ...updated } : ct))
          );
          addToast('Contribution type updated', 'success');
        }
      } catch (error) {
        console.error('Contribution type update error:', error);
      }
    },
    [addToast]
  );

  const deleteContributionType = useCallback(
    async (id) => {
      try {
        const res = await fetch(`/api/contribution-types?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setContributionTypes((prev) => prev.filter((ct) => ct.id !== id));
          addToast('Contribution type deleted', 'warning');
        }
      } catch (error) {
        console.error('Contribution type delete error:', error);
      }
    },
    [addToast]
  );

  return {
    contributions,
    setContributions,
    addContribution,
    updateContribution,
    deleteContribution,
    approveContribution,
    rejectContribution,
    campaigns,
    setCampaigns,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    contributionTypes,
    setContributionTypes,
    addContributionType,
    updateContributionType,
    deleteContributionType,
  };
}
