import { useEffect } from 'react';

import {
  getChatSocket,
  subscribeAppointmentChanges,
  subscribeDashboardStatsChanges,
} from '../utils/chatSocket';

type Options = {
  /** Also refetch when PSW profile stats / earnings sync from server */
  watchDashboardStats?: boolean;
  enabled?: boolean;
};

/**
 * Refetches immediately when appointments or earnings change on another device/tab.
 */
export function useLiveDataRefresh(onRefresh: () => void, options: Options = {}): void {
  const { watchDashboardStats = false, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return undefined;

    getChatSocket().catch(() => {});

    const unsubAppointments = subscribeAppointmentChanges(() => {
      onRefresh();
    });

    const unsubStats = watchDashboardStats
      ? subscribeDashboardStatsChanges(() => {
          onRefresh();
        })
      : undefined;

    return () => {
      unsubAppointments();
      unsubStats?.();
    };
  }, [onRefresh, watchDashboardStats, enabled]);
}
