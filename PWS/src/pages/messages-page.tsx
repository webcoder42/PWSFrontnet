import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consumePendingChat } from '../utils/chatPending';
import { clsx } from 'clsx';

import DashboardSidebar from '../components/dashboard/dashboardSidebar/dashboardSidebar';
import DashboardHeader from '../components/dashboard/dashboardHeader/dashboardHeader';
import ChatList from '../components/dashboard/messages/chatList/chatList';
import ChatWindow from '../components/dashboard/messages/chatWindow/chatWindow';
import { useUser } from '../context/UserContext';
import { useCall } from '../context/CallContext';
import { useChatRealtime } from '../hooks/useChatRealtime';
import {
  getChatConversationAPI,
  getOrCreateChatConversationAPI,
  listChatConversationsAPI,
  sendChatMessageAPI,
  startVoiceCallAPI,
} from '../utils/api';
import {
  appendMessageIfNew,
  avatarFallback,
  formatConversationTime,
  formatMessageTime,
  countUnreadMessages,
  getOtherParticipant,
  getUserId,
  mapMessageReadStatus,
  normalizeUserId,
} from '../utils/chatHelpers';
import { getChatSocket, subscribeChatMessages, subscribeIncomingCalls } from '../utils/chatSocket';

type DisplayMessage = {
  id: string;
  text: string;
  time: string;
  type: 'incoming' | 'outgoing';
  status?: 'sent' | 'read';
};

const mapRawToDisplay = (msg: Record<string, unknown>, userId: string): DisplayMessage => ({
  id: String(msg._id || `${msg.sentAt}-${msg.text}`),
  text: String(msg.text || ''),
  time: formatMessageTime(msg.sentAt as string | Date | undefined),
  type: normalizeUserId(msg.senderId) === userId ? 'outgoing' : 'incoming',
  status:
    normalizeUserId(msg.senderId) === userId
      ? mapMessageReadStatus(msg.isRead as boolean | undefined)
      : undefined,
});

const MessagesPage = () => {
  const { rawUser, isHydrated } = useUser();
  const { initiateCall } = useCall();
  const myUserId = getUserId(rawUser);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const pendingHandledRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isChatOpenOnMobile, setIsChatOpenOnMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => listChatConversationsAPI().then(r => (Array.isArray(r.data) ? r.data : [])),
    enabled: !!myUserId,
  });

  const { data: conversationData } = useQuery({
    queryKey: ['conversation', activeConversationId],
    queryFn: () => getChatConversationAPI(activeConversationId!).then(r => r.data),
    enabled: !!activeConversationId,
  });

  const activeMessages = useMemo<DisplayMessage[]>(() => {
    if (!conversationData?.messages) return [];
    return (Array.isArray(conversationData.messages) ? conversationData.messages : [])
      .map((msg: Record<string, unknown>) => mapRawToDisplay(msg, myUserId));
  }, [conversationData, myUserId]);

  const activePeer = useMemo(() => {
    if (!conversationData) return null;
    const peer = getOtherParticipant(conversationData, myUserId);
    return {
      id: peer._id || peer.id,
      name: peer.name,
      avatar: peer.photoUrl || avatarFallback(peer.name),
      status: peer.role === 'looking_for_care' ? 'Client' : 'PSW · Care Provider',
    };
  }, [conversationData, myUserId]);

  const sendMessageMutation = useMutation({
    mutationFn: ({ conversationKey, text }: { conversationKey: string; text: string }) =>
      sendChatMessageAPI(conversationKey, text),
    onSuccess: (res, { conversationKey }) => {
      const newMessage = res?.data?.message as Record<string, unknown> | undefined;
      if (newMessage) {
        queryClient.setQueryData(['conversation', conversationKey], (old: any) => {
          if (!old) return old;
          return {
            ...old,
            messages: appendMessageIfNew(Array.isArray(old.messages) ? [...old.messages] : [], newMessage),
          };
        });
        queryClient.setQueryData<any[]>(['conversations'], (old) => {
          if (!old) return old;
          const idx = old.findIndex((c) => c.conversationKey === conversationKey);
          if (idx === -1) return old;
          const updated = [...old];
          updated[idx] = { ...updated[idx], messages: appendMessageIfNew(
            Array.isArray(updated[idx].messages) ? [...updated[idx].messages] : [], newMessage
          ), lastMessageAt: String(newMessage.sentAt || new Date().toISOString()) };
          return updated.sort(
            (a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime(),
          );
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ['conversation', conversationKey] });
      }
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to send message');
    },
  });

  const openWithOtherUser = useCallback(
    async (otherUserId: string) => {
      if (!otherUserId || (myUserId && otherUserId === myUserId)) return;
      try {
        const res = await getOrCreateChatConversationAPI(otherUserId);
        const conv = res.data;
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        setActiveConversationId(conv.conversationKey);
        setIsChatOpenOnMobile(true);
      } catch (err: any) {
        setError(err.message || 'Failed to open conversation');
      }
    },
    [queryClient],
  );

  const upsertConversationFromSocket = useCallback(
    (payload: { conversationKey?: string; message?: Record<string, unknown>; lastMessageAt?: string }) => {
      if (!payload?.conversationKey) return;
      queryClient.setQueryData<any[]>(['conversations'], (prev) => {
        if (!prev) return prev;
        const idx = prev.findIndex((c) => c.conversationKey === payload.conversationKey);
        if (idx === -1) return prev;
        const updated = [...prev];
        const existing = { ...updated[idx] };
        const nextMessages = Array.isArray(existing.messages) ? [...existing.messages] : [];
        if (payload.message) {
          existing.messages = appendMessageIfNew(nextMessages, payload.message);
        }
        existing.lastMessageAt = payload.lastMessageAt || existing.lastMessageAt;
        updated[idx] = existing;
        return updated.sort(
          (a, b) =>
            new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime(),
        );
      });
    },
    [queryClient],
  );

  const appendIncomingMessage = useCallback(
    (incoming: Record<string, unknown>) => {
      if (!activeConversationId) return;
      queryClient.setQueryData(['conversation', activeConversationId], (old: any) => {
        if (!old) return old;
        const display = mapRawToDisplay(incoming, myUserId);
        const msgs = Array.isArray(old.messages) ? [...old.messages] : [];
        if (msgs.some((m: any) => String(m._id || '') === String(incoming._id || ''))) return old;
        return { ...old, messages: [...msgs, incoming] };
      });
    },
    [activeConversationId, myUserId, queryClient],
  );

  useEffect(() => {
    if (!myUserId) return undefined;
    getChatSocket().catch(() => {});
    return subscribeChatMessages((payload) => {
      upsertConversationFromSocket(payload);
    });
  }, [myUserId, upsertConversationFromSocket]);

  useChatRealtime({
    conversationKey: activeConversationId,
    enabled: Boolean(activeConversationId),
    onMessage: appendIncomingMessage,
  });

  useEffect(() => {
    if (!isHydrated || !myUserId || pendingHandledRef.current) return;
    const pending = consumePendingChat();
    if (!pending?.otherUserId) return;
    if (pending.otherUserId === myUserId) return;
    pendingHandledRef.current = true;
    void openWithOtherUser(pending.otherUserId);
  }, [isHydrated, myUserId, openWithOtherUser]);

  const filteredConversations = useMemo(() => {
    return conversations
      .map((conv) => {
        const peer = getOtherParticipant(conv, myUserId);
        const last = conv.messages?.length ? conv.messages[conv.messages.length - 1] : null;
        return {
          id: conv.conversationKey,
          name: peer.name,
          avatar: peer.photoUrl || avatarFallback(peer.name),
          lastMessage: last?.text || 'No messages yet',
          time: formatConversationTime(conv.lastMessageAt || conv.updatedAt),
          unreadCount: countUnreadMessages(conv.messages, myUserId),
          status: peer.role === 'looking_for_care' ? 'Client' : 'PSW',
        };
      })
      .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [conversations, myUserId, searchQuery]);

  const activeChat =
    activeConversationId && activePeer
      ? {
          id: activeConversationId,
          name: activePeer.name,
          avatar: activePeer.avatar,
          status: activePeer.status,
        }
      : null;

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setIsChatOpenOnMobile(true);
  };

  const handleSendMessage = (text: string) => {
    if (!activeConversationId) return;
    sendMessageMutation.mutate({ conversationKey: activeConversationId, text });
  };

  const handleStartCall = async () => {
    if (!activePeer || !activeConversationId) return;
    try {
      await initiateCall(
        activeConversationId,
        activePeer.name,
        activePeer.status,
        activePeer.avatar,
        activePeer.id
      );
    } catch (err: any) {
      setError(err.message || 'Failed to start call');
    }
  };

  return (
    <div className="flex h-screen w-full bg-surface-vibrant font-dm overflow-hidden">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 p-0 sm:p-6 lg:p-10 flex flex-col overflow-hidden">
          <h1 className="hidden sm:block text-3xl lg:text-4xl font-bold text-gray-900 font-playfair mb-8">Messages</h1>
          {error && <p className="text-sm text-rose-500 mb-2 px-4">{error}</p>}

          <div className="flex-1 flex min-h-0 sm:shadow-logs sm:rounded-xl overflow-hidden bg-white">
            <div
              className={clsx(
                'w-full md:w-80 lg:w-96 border-r border-gray-100 duration-300',
                isChatOpenOnMobile ? 'hidden md:block' : 'block',
              )}
            >
              {isLoading ? (
                <p className="p-6 text-sm text-gray-400">Loading conversations...</p>
              ) : (
                <ChatList
                  conversations={filteredConversations}
                  activeId={activeConversationId || ''}
                  onSelect={handleSelectConversation}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              )}
            </div>

            <div
              className={clsx(
                'flex-1 min-w-0 min-h-0 h-full flex flex-col duration-300',
                !isChatOpenOnMobile ? 'hidden md:block' : 'block',
              )}
            >
              <ChatWindow
                activeChat={activeChat}
                messages={activeMessages}
                onSendMessage={handleSendMessage}
                onBack={() => setIsChatOpenOnMobile(false)}
                onStartCall={handleStartCall}
                messagesEndRef={messagesEndRef}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MessagesPage;
