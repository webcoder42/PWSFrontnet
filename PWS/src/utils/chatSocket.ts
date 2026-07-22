import { io, type Socket } from 'socket.io-client';

import { readAuthToken } from './sessionStorage';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.mypswplus.com/api';
const cleanUrl = rawBaseUrl.replace(/\/+$/, '');
const API_BASE_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
export const SOCKET_SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');

type ChatMessagePayload = {
  conversationKey?: string;
  message?: Record<string, unknown>;
  lastMessageAt?: string;
};

type MessageListener = (payload: ChatMessagePayload) => void;

export type AppointmentChangedPayload = {
  type?: string;
  appointmentId?: string;
  userId?: string;
  pswId?: string;
  timestamp?: string;
};

export type DashboardStatsChangedPayload = {
  pswId?: string;
  timestamp?: string;
};

type AppointmentListener = (payload: AppointmentChangedPayload) => void;
type DashboardStatsListener = (payload: DashboardStatsChangedPayload) => void;
export type IncomingCallPayload = {
  callId?: string;
  conversationKey?: string;
  fromUserId?: string;
  fromName?: string;
  streamCallUrl?: string;
  timestamp?: string;
  streamApiKey?: string;
};
type IncomingCallListener = (payload: IncomingCallPayload) => void;

export type CallEndedPayload = {
  callId?: string;
  conversationKey?: string;
  status?: 'answered' | 'declined' | 'missed' | 'ended';
};
type CallEndedListener = (payload: CallEndedPayload) => void;

export type CallSignalPayload = {
  fromUserId: string;
  signal: any;
};
type CallSignalListener = (payload: CallSignalPayload) => void;

let socket: Socket | null = null;
let connectPromise: Promise<Socket> | null = null;
const messageListeners = new Set<MessageListener>();
const appointmentListeners = new Set<AppointmentListener>();
const dashboardStatsListeners = new Set<DashboardStatsListener>();
const incomingCallListeners = new Set<IncomingCallListener>();
const callEndedListeners = new Set<CallEndedListener>();
const callSignalListeners = new Set<CallSignalListener>();
let joinedConversationKey: string | null = null;

/**
 * Fully disconnect and destroy the socket singleton.
 * Must be called on account switch so the next getChatSocket() creates a
 * fresh connection authenticated with the new user's token.
 */
export const disconnectChatSocket = (): void => {
  connectPromise = null;
  joinedConversationKey = null;
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};

const waitForSocketConnect = (instance: Socket) =>
  new Promise<void>((resolve, reject) => {
    if (instance.connected) {
      resolve();
      return;
    }

    const onConnect = () => {
      cleanup();
      resolve();
    };
    const onError = (err: Error) => {
      cleanup();
      reject(err);
    };
    const cleanup = () => {
      instance.off('connect', onConnect);
      instance.off('connect_error', onError);
    };

    instance.on('connect', onConnect);
    instance.on('connect_error', onError);
  });

const attachSocketHandlers = (instance: Socket) => {
  instance.off('chat:message');
  instance.on('chat:message', (payload: ChatMessagePayload) => {
    messageListeners.forEach((listener) => listener(payload));
  });

  instance.off('appointment:changed');
  instance.on('appointment:changed', (payload: AppointmentChangedPayload) => {
    appointmentListeners.forEach((listener) => listener(payload));
  });

  instance.off('dashboard:stats_changed');
  instance.on('dashboard:stats_changed', (payload: DashboardStatsChangedPayload) => {
    dashboardStatsListeners.forEach((listener) => listener(payload));
  });

  instance.off('chat:incoming_call');
  instance.on('chat:incoming_call', (payload: IncomingCallPayload) => {
    incomingCallListeners.forEach((listener) => listener(payload));
  });

  instance.off('chat:call_ended');
  instance.on('chat:call_ended', (payload: CallEndedPayload) => {
    callEndedListeners.forEach((listener) => listener(payload));
  });

  instance.off('chat:call_signal');
  instance.on('chat:call_signal', (payload: CallSignalPayload) => {
    callSignalListeners.forEach((listener) => listener(payload));
  });

  instance.off('connect');
  instance.on('connect', () => {
    if (joinedConversationKey) {
      instance.emit('join_conversation', { conversationKey: joinedConversationKey });
    }
  });
};

export const subscribeChatMessages = (listener: MessageListener) => {
  messageListeners.add(listener);
  getChatSocket().catch((err) => {
    console.warn('[chat socket] connect failed:', err?.message || err);
  });
  return () => {
    messageListeners.delete(listener);
  };
};

export const subscribeAppointmentChanges = (listener: AppointmentListener) => {
  appointmentListeners.add(listener);
  getChatSocket().catch((err) => {
    console.warn('[appointment socket] connect failed:', err?.message || err);
  });
  return () => {
    appointmentListeners.delete(listener);
  };
};

export const subscribeDashboardStatsChanges = (listener: DashboardStatsListener) => {
  dashboardStatsListeners.add(listener);
  getChatSocket().catch((err) => {
    console.warn('[dashboard socket] connect failed:', err?.message || err);
  });
  return () => {
    dashboardStatsListeners.delete(listener);
  };
};

export const subscribeIncomingCalls = (listener: IncomingCallListener) => {
  incomingCallListeners.add(listener);
  getChatSocket().catch((err) => {
    console.warn('[call socket] connect failed:', err?.message || err);
  });
  return () => {
    incomingCallListeners.delete(listener);
  };
};

export const getChatSocket = async (): Promise<Socket> => {
  if (socket?.connected) return socket;

  if (socket && !socket.connected) {
    socket.connect();
    await waitForSocketConnect(socket);
    return socket;
  }

  if (connectPromise) return connectPromise;

  connectPromise = (async () => {
    const token = readAuthToken();
    if (!token) {
      connectPromise = null;
      throw new Error('Not authenticated for chat socket.');
    }

    const instance = io(SOCKET_SERVER_URL, {
      auth: { token },
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    attachSocketHandlers(instance);
    await waitForSocketConnect(instance);

    socket = instance;
    connectPromise = null;
    return instance;
  })();

  return connectPromise;
};

export const joinChatConversation = (activeSocket: Socket, conversationKey: string) => {
  joinedConversationKey = conversationKey;
  activeSocket.emit('join_conversation', { conversationKey });
};

export const leaveChatConversation = (activeSocket: Socket, conversationKey: string) => {
  if (joinedConversationKey === conversationKey) joinedConversationKey = null;
  activeSocket.emit('leave_conversation', { conversationKey });
};

export const subscribeCallEnded = (listener: CallEndedListener) => {
  callEndedListeners.add(listener);
  getChatSocket().catch(() => {});
  return () => {
    callEndedListeners.delete(listener);
  };
};

export const subscribeCallSignal = (listener: CallSignalListener) => {
  callSignalListeners.add(listener);
  getChatSocket().catch(() => {});
  return () => {
    callSignalListeners.delete(listener);
  };
};

export const emitCallSignal = (activeSocket: Socket, targetUserId: string, signal: any) => {
  activeSocket.emit('chat:call_signal', { targetUserId, signal });
};
