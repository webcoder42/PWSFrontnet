import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getChatSocket, subscribeAppointmentChanges, subscribeChatMessages } from '../utils/chatSocket';

const STORAGE_KEY = 'pws_web_notifications_v1';
const MAX_ITEMS = 50;

const NotificationCenterContext = createContext(null);

const readStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export const NotificationCenterProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  const addNotification = useCallback((payload) => {
    setNotifications((prev) => {
      if (payload.externalKey && prev.some((n) => n.externalKey === payload.externalKey)) {
        return prev;
      }
      const next = [
        {
          id: makeId(),
          type: payload.type,
          title: payload.title,
          body: payload.body,
          createdAt: new Date().toISOString(),
          read: false,
          data: payload.data || {},
          externalKey: payload.externalKey,
        },
        ...prev,
      ];
      return next.slice(0, MAX_ITEMS);
    });
  }, []);

  useEffect(() => {
    getChatSocket().catch(() => {});
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
        data: { conversationKey },
      });
    });
    const unsubAppointment = subscribeAppointmentChanges((payload) => {
      const changeType = String(payload?.type || '');
      let title = 'Appointment update';
      if (changeType === 'created') title = 'New appointment booked';
      if (changeType === 'status_changed') title = 'Appointment status updated';
      if (changeType === 'rescheduled') title = 'Appointment rescheduled';
      addNotification({
        type: 'appointment_update',
        title,
        body: 'Open appointments to view details.',
        externalKey: `appt:${String(payload?.appointmentId || '')}:${changeType}:${String(payload?.timestamp || '')}`,
      });
    });
    return () => {
      unsubChat();
      unsubAppointment();
    };
  }, [addNotification]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => (item.read ? item : { ...item, read: true })));
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const unreadCount = useMemo(
    () => notifications.reduce((total, item) => total + (item.read ? 0 : 1), 0),
    [notifications],
  );

  const value = useMemo(
    () => ({ notifications, unreadCount, markAllRead, markRead, removeNotification }),
    [notifications, unreadCount, markAllRead, markRead, removeNotification],
  );

  return <NotificationCenterContext.Provider value={value}>{children}</NotificationCenterContext.Provider>;
};

export const useNotificationCenter = () => {
  const context = useContext(NotificationCenterContext);
  if (!context) throw new Error('useNotificationCenter must be used inside NotificationCenterProvider');
  return context;
};
