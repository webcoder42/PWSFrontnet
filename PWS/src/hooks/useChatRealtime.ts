import { useEffect, useRef } from 'react';

import {
  getChatSocket,
  joinChatConversation,
  leaveChatConversation,
  subscribeChatMessages,
} from '../utils/chatSocket';

type UseChatRealtimeOptions = {
  conversationKey: string | null;
  enabled?: boolean;
  onMessage: (message: Record<string, unknown>) => void;
};

export const useChatRealtime = ({
  conversationKey,
  enabled = true,
  onMessage,
}: UseChatRealtimeOptions): void => {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!enabled || !conversationKey || conversationKey.startsWith('opening-')) return undefined;

    const handlePayload = (payload: { conversationKey?: string; message?: Record<string, unknown> }) => {
      if (payload.conversationKey !== conversationKey) return;
      if (payload.message && typeof payload.message === 'object') {
        onMessageRef.current(payload.message);
      }
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
