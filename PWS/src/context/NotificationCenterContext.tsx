import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { subscribeAppointmentChanges, subscribeChatMessages } from '../utils/chatSocket';

export type NotificationItem = {
  id: string;
  type: 'chat_message' | 'appointment_update';
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  externalKey?: string;
};

type NotificationCenterValue = {
  notifications: NotificationItem[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
};

const STORAGE_KEY = 'pws_portal_notifications_v1';
const MAX_ITEMS = 50;

const NotificationCenterContext = createContext<NotificationCenterValue | null>(null);

const makeId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const readStored = (): NotificationItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as NotificationItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function NotificationCenterProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  const addNotification = useCallback((payload: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    setNotifications((prev) => {
      if (payload.externalKey && prev.some((item) => item.externalKey === payload.externalKey)) {
        return prev;
      }
      const next: NotificationItem[] = [
        {
          id: makeId(),
          type: payload.type,
          title: payload.title,
          body: payload.body,
          createdAt: new Date().toISOString(),
          read: false,
          externalKey: payload.externalKey,
        },
        ...prev,
      ];
      return next.slice(0, MAX_ITEMS);
    });
  }, []);

  useEffect(() => {
    const unsubChat = subscribeChatMessages((payload) => {
      const text = String(payload?.message?.text || '').trim();
      if (!text) return;
      const messageId = String(payload?.message?._id || '');
      const conversationKey = String(payload?.conversationKey || '');
      addNotification({
        type: 'chat_message',
        title: 'New message',
        body: text.length > 120 ? `${text.slice(0, 117)}...` : text,
        externalKey: messageId || `${conversationKey}:${String(payload?.message?.sentAt || '')}`,
      });
    });

    const unsubAppointments = subscribeAppointmentChanges((payload) => {
      const changeType = String(payload?.type || '');
      let title = 'Appointment update';
      if (changeType === 'created') title = 'New appointment booked';
      if (changeType === 'status_changed') title = 'Appointment status updated';
      if (changeType === 'rescheduled') title = 'Appointment rescheduled';
      addNotification({
        type: 'appointment_update',
        title,
        body: 'Open to view details.',
        externalKey: `appt:${String(payload?.appointmentId || '')}:${changeType}:${String(payload?.timestamp || '')}`,
      });
    });

    return () => {
      unsubChat();
      unsubAppointments();
    };
  }, [addNotification]);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => (item.read ? item : { ...item, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const unreadCount = useMemo(
    () => notifications.reduce((count, item) => count + (item.read ? 0 : 1), 0),
    [notifications],
  );

  const value = useMemo<NotificationCenterValue>(
    () => ({ notifications, unreadCount, markRead, markAllRead, removeNotification }),
    [notifications, unreadCount, markRead, markAllRead, removeNotification],
  );

  return <NotificationCenterContext.Provider value={value}>{children}</NotificationCenterContext.Provider>;
}

export function useNotificationCenter(): NotificationCenterValue {
  const context = useContext(NotificationCenterContext);
  if (!context) {
    throw new Error('useNotificationCenter must be used within NotificationCenterProvider');
  }
  return context;
}
