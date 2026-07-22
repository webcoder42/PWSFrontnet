import { useEffect, useRef } from 'react';

import {
  getChatSocket,
  joinChatConversation,
  leaveChatConversation,
  subscribeChatMessages,
} from '../utils/chatSocket';

export const useChatRealtime = ({ conversationKey, enabled = true, onMessage }) => {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!enabled || !conversationKey) return undefined;

    const handlePayload = (payload) => {
      if (payload.conversationKey !== conversationKey) return;
      if (payload.message) onMessageRef.current?.(payload.message);
    };

    const unsubscribe = subscribeChatMessages(handlePayload);

    getChatSocket()
      .then((socketInstance) => joinChatConversation(socketInstance, conversationKey))
      .catch((err) => console.warn('[useChatRealtime]', err?.message || err));

    return () => {
      unsubscribe();
      getChatSocket()
        .then((socketInstance) => leaveChatConversation(socketInstance, conversationKey))
        .catch(() => {});
    };
  }, [conversationKey, enabled]);
};
