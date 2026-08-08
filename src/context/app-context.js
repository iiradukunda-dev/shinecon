'use client';
import { createContext, useContext, useMemo, useEffect, useCallback } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { useMembers } from '@/hooks/useMembers';
import { useFinance } from '@/hooks/useFinance';
import { useCommunications } from '@/hooks/useCommunications';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Extract modular domain logic
  const auth = useAuth();
  const ui = useUI();
  const membersData = useMembers(ui.addToast);
  const financeData = useFinance(ui.addToast);
  const commsData = useCommunications(ui.addToast);

  // ── Bootstrap (Load all data from DB) ─────────────────
  const bootstrap = useCallback(
    async (silent = false) => {
      try {
        const res = await fetch('/api/bootstrap?_t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.members) membersData.setMembers(data.members);
          if (data.contributions) financeData.setContributions(data.contributions);
          if (data.campaigns) financeData.setCampaigns(data.campaigns);
          if (data.contributionTypes) financeData.setContributionTypes(data.contributionTypes);
          if (data.events) commsData.setEvents(data.events);
          if (data.announcements) commsData.setAnnouncements(data.announcements);
          if (data.messages) commsData.setMessages(data.messages);
          if (data.attendance) commsData.setAttendance(data.attendance);
          if (data.notifications) commsData.setNotifications(data.notifications);

          // Fetch settings explicitly for global config
          fetch('/api/settings?_t=' + Date.now(), { cache: 'no-store' })
            .then((res) => res.json())
            .then((settingData) => {
              if (!settingData.error) {
                ui.setSettings(settingData);
              }
            })
            .catch(() => {});
        } else if (!silent) {
          ui.addToast('Failed to connect to database. Running in offline/fallback mode.', 'warning');
        }
      } catch (error) {
        if (!silent) console.error('Failed to load database entries:', error);
      }
    },
    [] // Removing unstable object dependencies to prevent infinite loops
  );

  useEffect(() => {
    bootstrap(false);
    const interval = setInterval(() => {
      bootstrap(true);
    }, 60000); // Poll every 60 seconds
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Computed Stats ──────────────────────────────────
  const stats = useMemo(
    () => ({
      totalMembers: membersData.members.length,
      approvedMembers: membersData.members.filter((m) => m.status === 'approved').length,
      pendingMembers: membersData.members.filter((m) => m.status === 'pending').length,
      totalContributions: financeData.contributions.filter((c) => c.status === 'approved').length,
      pendingContributions: financeData.contributions.filter((c) => c.status === 'pending').length,
      monthlyRWF: financeData.contributions
        .filter((c) => c.status === 'approved' && c.currency === 'RWF')
        .reduce((s, c) => s + c.amount, 0),
      activeCampaigns: financeData.campaigns.filter((c) => c.status === 'active').length,
      localMembers: membersData.members.filter((m) => m.type === 'local').length,
      diasporaMembers: membersData.members.filter((m) => m.type === 'diaspora').length,
      studentMembers: membersData.members.filter((m) => m.employment === 'student').length,
      employedMembers: membersData.members.filter((m) => m.employment === 'employed').length,
    }),
    [membersData.members, financeData.contributions, financeData.campaigns],
  );

  const contextValue = useMemo(
    () => ({
      ...auth,
      ...ui,
      ...membersData,
      ...financeData,
      ...commsData,
      stats,
    }),
    [
      auth,
      ui,
      membersData,
      financeData,
      commsData,
      stats,
    ],
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
