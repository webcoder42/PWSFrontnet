import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const pendingHandledRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isChatOpenOnMobile, setIsChatOpenOnMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeMessages, setActiveMessages] = useState<DisplayMessage[]>([]);
  const [activePeer, setActivePeer] = useState<{ id: string; name: string; avatar: string; status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadConversations = useCallback(async () => {
    if (!myUserId) return;
    setLoading(true);
    try {
      const res = await listChatConversationsAPI();
      setConversations(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [myUserId]);

  const loadConversation = useCallback(
    async (conversationKey: string) => {
      setError('');
      try {
        const res = await getChatConversationAPI(conversationKey);
        const conv = res.data;
        const peer = getOtherParticipant(conv, myUserId);
        setActivePeer({
          id: peer._id || peer.id,
          name: peer.name,
          avatar: peer.photoUrl || avatarFallback(peer.name),
          status: peer.role === 'looking_for_care' ? 'Client' : 'PSW · Care Provider',
        });
        setActiveMessages(
          (Array.isArray(conv.messages) ? conv.messages : []).map((msg: Record<string, unknown>) =>
            mapRawToDisplay(msg, myUserId),
          ),
        );
      } catch (err: any) {
        setError(err.message || 'Failed to load messages');
      }
    },
    [myUserId],
  );

  const openWithOtherUser = useCallback(
    async (otherUserId: string) => {
      // Hard guard: never create a conversation with yourself.
      // This covers all call sites (pending-chat, direct navigation, etc.)
      if (!otherUserId || (myUserId && otherUserId === myUserId)) return;
      try {
        const res = await getOrCreateChatConversationAPI(otherUserId);
        const conv = res.data;
        await loadConversations();
        setActiveConversationId(conv.conversationKey);
        setIsChatOpenOnMobile(true);
        await loadConversation(conv.conversationKey);
      } catch (err: any) {
        setError(err.message || 'Failed to open conversation');
      }
    },
    [loadConversation, loadConversations],
  );

  const scrollToBottom = useCallback(() => {
    // Scrolling is handled internally by ChatWindow's scroll container
  }, []);

  const upsertConversationFromSocket = useCallback(
    (payload: { conversationKey?: string; message?: Record<string, unknown>; lastMessageAt?: string }) => {
      if (!payload?.conversationKey) return;
      setConversations((prev) => {
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
    [],
  );

  const appendIncomingMessage = useCallback(
    (incoming: Record<string, unknown>) => {
      const display = mapRawToDisplay(incoming, myUserId);
      setActiveMessages((prev) => {
        if (prev.some((m) => m.id === display.id)) return prev;
        return [...prev, display];
      });
      scrollToBottom();
    },
    [myUserId, scrollToBottom],
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

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
    scrollToBottom();
  }, [activeMessages, scrollToBottom]);

  useEffect(() => {
    if (!isHydrated || !myUserId || pendingHandledRef.current) return;
    const pending = consumePendingChat();
    if (!pending?.otherUserId) return;
    // Guard: never open a conversation with yourself (can happen if a stale
    // pending-chat entry survives an account switch).
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

  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id);
    setIsChatOpenOnMobile(true);
    await loadConversation(id);
  };

  const handleSendMessage = async (text: string) => {
    if (!activeConversationId) return;
    try {
      const res = await sendChatMessageAPI(activeConversationId, text);
      const newMessage = res?.data?.message as Record<string, unknown> | undefined;
      if (newMessage) {
        appendIncomingMessage(newMessage);
        upsertConversationFromSocket({
          conversationKey: activeConversationId,
          message: newMessage,
          lastMessageAt: String(newMessage.sentAt || new Date().toISOString()),
        });
      } else {
        await loadConversation(activeConversationId);
      }
      await loadConversations();
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    }
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
              {loading ? (
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
