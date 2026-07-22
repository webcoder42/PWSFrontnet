import { io } from 'socket.io-client';

import { readAuthToken, SOCKET_SERVER_URL } from './chatApi';

let socket = null;
let connectPromise = null;
const messageListeners = new Set();
const appointmentListeners = new Set();
let joinedConversationKey = null;

const waitForSocketConnect = (instance) =>
  new Promise((resolve, reject) => {
    if (instance.connected) {
      resolve();
      return;
    }

    const onConnect = () => {
      cleanup();
      resolve();
    };
    const onError = (err) => {
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

const attachSocketHandlers = (instance) => {
  instance.off('chat:message');
  instance.on('chat:message', (payload) => {
    messageListeners.forEach((listener) => listener(payload));
  });

  instance.off('connect');
  instance.on('connect', () => {
    if (joinedConversationKey) {
      instance.emit('join_conversation', { conversationKey: joinedConversationKey });
    }
  });

  instance.off('appointment:changed');
  instance.on('appointment:changed', (payload) => {
    appointmentListeners.forEach((listener) => listener(payload));
  });
};

export const subscribeChatMessages = (listener) => {
  messageListeners.add(listener);
  getChatSocket().catch((err) => {
    console.warn('[chat socket] connect failed:', err?.message || err);
  });
  return () => {
    messageListeners.delete(listener);
  };
};

export const getChatSocket = async () => {
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
    console.log('[chat socket] connected to', SOCKET_SERVER_URL);
    return instance;
  })();

  return connectPromise;
};

export const subscribeAppointmentChanges = (listener) => {
  appointmentListeners.add(listener);
  getChatSocket().catch((err) => {
    console.warn('[appointment socket] connect failed:', err?.message || err);
  });
  return () => {
    appointmentListeners.delete(listener);
  };
};

export const joinChatConversation = (activeSocket, conversationKey) => {
  joinedConversationKey = conversationKey;
  activeSocket.emit('join_conversation', { conversationKey });
};

export const leaveChatConversation = (activeSocket, conversationKey) => {
  if (joinedConversationKey === conversationKey) joinedConversationKey = null;
  activeSocket.emit('leave_conversation', { conversationKey });
};
