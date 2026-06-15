import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ECallButton from '../../components/dashboard/messages/eCallButton/eCallButton';
import { useUser } from '../../context/UserContext';
import { useCall } from '../../context/CallContext';
import { useChatRealtime } from '../../hooks/useChatRealtime';
import { consumePendingChat } from '../../utils/chatPending';
import {
  getChatConversationAPI,
  getOrCreateChatConversationAPI,
  listChatConversationsAPI,
  sendChatMessageAPI,
  startVoiceCallAPI,
} from '../../utils/api';
import {
  appendMessageIfNew,
  avatarFallback,
  formatConversationTime,
  formatMessageTime,
  getOtherParticipant,
  countUnreadMessages,
  getUserId,
  mapMessageReadStatus,
  normalizeUserId,
} from '../../utils/chatHelpers';
import { getChatSocket, subscribeChatMessages, subscribeIncomingCalls } from '../../utils/chatSocket';

const Messages = () => {
  const { rawUser, isHydrated } = useUser();
  const { initiateCall } = useCall();
  const myUserId = getUserId(rawUser);
  const navigate = useNavigate();
  const pendingHandledRef = useRef(false);

  const [conversations, setConversations] = useState([]);
  const [activeKey, setActiveKey] = useState(null);
  const [activeMessages, setActiveMessages] = useState([]);
  const [activePeer, setActivePeer] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [search, setSearch] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const loadConversations = useCallback(async () => {
    if (!myUserId) return;
    setLoadingList(true);
    setError('');
    try {
      const res = await listChatConversationsAPI();
      setConversations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message || 'Could not load conversations');
    } finally {
      setLoadingList(false);
    }
  }, [myUserId]);

  const openConversation = useCallback(
    async (conversationKey, peerHint) => {
      if (!conversationKey || conversationKey.startsWith('opening-')) return;
      setLoadingChat(true);
      setError('');
      try {
        const res = await getChatConversationAPI(conversationKey);
        const conv = res.data;
        const peer = peerHint || getOtherParticipant(conv, myUserId);
        setActiveKey(conv.conversationKey || conversationKey);
        setActivePeer(peer);
        setActiveMessages(Array.isArray(conv.messages) ? conv.messages : []);
      } catch (err) {
        setActiveKey(null);
        setActivePeer(null);
        setError(err.message || 'Could not load messages');
      } finally {
        setLoadingChat(false);
      }
    },
    [myUserId],
  );

  const openWithOtherUser = useCallback(
    async (otherUserId, peerHint) => {
      // Hard guard: never create a conversation with yourself.
      if (!otherUserId || (myUserId && otherUserId === myUserId)) return;
      if (!otherUserId) return;
      setLoadingChat(true);
      setError('');
      setActiveKey(`opening-${otherUserId}`);
      if (peerHint?.name) {
        setActivePeer({
          id: otherUserId,
          name: peerHint.name,
          photoUrl: peerHint.photoUrl || avatarFallback(peerHint.name),
          role: 'care_provider',
        });
      }
      try {
        const res = await getOrCreateChatConversationAPI(otherUserId);
        const conv = res.data;
        await loadConversations();
        const peer = getOtherParticipant(conv, myUserId);
        setActiveKey(conv.conversationKey);
        setActivePeer(peer);
        setActiveMessages(Array.isArray(conv.messages) ? conv.messages : []);
      } catch (err) {
        setActiveKey(null);
        setActivePeer(null);
        const msg = err.message || 'Could not open chat';
        setError(/invalid|expired|token/i.test(msg) ? `${msg} — please log out and log in again.` : msg);
        if (/invalid|expired|token/i.test(msg)) {
          navigate('/login', { replace: true });
        }
      } finally {
        setLoadingChat(false);
      }
    },
    [loadConversations, myUserId, navigate],
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!isHydrated || !myUserId || pendingHandledRef.current) return;
    const pending = consumePendingChat();
    if (!pending?.otherUserId) return;
    // Guard: never open a conversation with yourself (can happen if a stale
    // pending-chat entry survives an account switch).
    if (pending.otherUserId === myUserId) return;
    pendingHandledRef.current = true;
    void openWithOtherUser(pending.otherUserId, {
      name: pending.peerName,
      photoUrl: pending.peerPhoto,
    });
  }, [isHydrated, myUserId, openWithOtherUser]);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    requestAnimationFrame(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior,
        });
      }
    });
  }, []);

  const upsertConversationFromSocket = useCallback((payload) => {
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
        (a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime(),
      );
    });
  }, []);

  useEffect(() => {
    if (!myUserId) return undefined;
    getChatSocket().catch(() => {});
    return subscribeChatMessages((payload) => {
      upsertConversationFromSocket(payload);
    });
  }, [myUserId, upsertConversationFromSocket]);

  const activeConversationKey =
    activeKey && !String(activeKey).startsWith('opening-') ? activeKey : null;

  useChatRealtime({
    conversationKey: activeConversationKey,
    enabled: Boolean(activeConversationKey),
    onMessage: (incoming) => {
      setActiveMessages((prev) => appendMessageIfNew(prev, incoming));
      scrollToBottom();
    },
  });

  useEffect(() => {
    scrollToBottom('auto');
  }, [activeKey, scrollToBottom]);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [activeMessages, scrollToBottom]);

  const listItems = useMemo(() => {
    return conversations
      .map((conv) => {
        const peer = getOtherParticipant(conv, myUserId);
        const last = conv.messages?.length ? conv.messages[conv.messages.length - 1] : null;
        return {
          key: conv.conversationKey,
          peer,
          lastMsg: last?.text || 'No messages yet',
          time: formatConversationTime(conv.lastMessageAt || conv.updatedAt),
          unreadCount: countUnreadMessages(conv.messages, myUserId),
        };
      })
      .filter((item) => item.peer.name.toLowerCase().includes(search.toLowerCase()));
  }, [conversations, myUserId, search]);

  const handleSend = async () => {
    const text = messageText.trim();
    const conversationKey = activeConversationKey;
    if (!text || !conversationKey || sending) return;
    setSending(true);
    try {
      const res = await sendChatMessageAPI(conversationKey, text);
      setMessageText('');
      const newMessage = res?.data?.message;
      if (newMessage) {
        setActiveMessages((prev) => appendMessageIfNew(prev, newMessage));
        upsertConversationFromSocket({
          conversationKey,
          message: newMessage,
          lastMessageAt: newMessage.sentAt || new Date().toISOString(),
        });
      } else {
        const refreshed = await getChatConversationAPI(conversationKey);
        setActiveMessages(Array.isArray(refreshed.data?.messages) ? refreshed.data.messages : []);
      }
      await loadConversations();
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleStartCall = async () => {
    if (!activePeer?.name || !activeConversationKey) return;
    try {
      await initiateCall(
        activeConversationKey,
        activePeer.name,
        activePeer.role === 'care_provider' ? 'PSW · Care Provider' : 'Client',
        activePeer.photoUrl || '',
        activePeer.id || activePeer._id
      );
    } catch (err) {
      setError(err.message || 'Failed to start call');
    }
  };

  const peerAvatar = activePeer?.photoUrl || avatarFallback(activePeer?.name || 'user');
  const peerRole =
    activePeer?.role === 'care_provider' ? 'PSW · Care Provider' : 'Client';

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden animate-in fade-in duration-700">
      <div className="w-80 border-r border-gray-50 flex flex-col h-full bg-white relative z-10">
        <div className="p-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Messages</h2>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pt-0.5">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs w-full focus:ring-1 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 px-3 pb-6">
          {loadingList && <p className="text-xs text-gray-400 px-4">Loading conversations...</p>}
          {!loadingList && listItems.length === 0 && (
            <p className="text-xs text-gray-400 px-4">No conversations yet. Message your PSW from an appointment.</p>
          )}
          {listItems.map((conv) => (
            <button
              key={conv.key}
              type="button"
              onClick={() => openConversation(conv.key, conv.peer)}
              className={`w-full p-4 rounded-2xl flex items-center transition-all mb-1 text-left ${
                activeKey === conv.key
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-100 scale-[1.02]'
                  : 'hover:bg-gray-50 text-gray-900'
              }`}
            >
              <img
                src={conv.peer.photoUrl || avatarFallback(conv.peer.name)}
                className={`w-12 h-12 rounded-2xl object-cover ring-2 ${activeKey === conv.key ? 'ring-purple-400' : 'ring-gray-100'}`}
                alt={conv.peer.name}
              />
              <div className="ml-4 flex-1 min-w-0 pr-2">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className={`text-sm font-bold truncate ${activeKey === conv.key ? 'text-white' : 'text-gray-900'}`}>
                    {conv.peer.name}
                  </h4>
                  <span className={`text-[10px] font-medium shrink-0 ${activeKey === conv.key ? 'text-purple-200' : 'text-gray-400'}`}>
                    {conv.time}
                  </span>
                </div>
                <p className={`text-[10px] truncate leading-tight ${activeKey === conv.key ? 'text-purple-100' : 'text-gray-500 font-medium'}`}>
                  {conv.lastMsg}
                </p>
              </div>
              {conv.unreadCount > 0 && activeKey !== conv.key && (
                <div className="bg-purple-600 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                  {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full min-h-0 bg-gray-25/30 relative">
        {error && !activeKey && (
          <p className="text-xs text-rose-500 px-6 py-4 text-center">{error}</p>
        )}
        {!activeKey ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <p className="text-gray-500 text-sm font-medium">Select a conversation to view message history</p>
          </div>
        ) : (
          <>
            <div className="shrink-0 p-6 border-b border-gray-50 flex justify-between items-center bg-white/80 backdrop-blur-md z-10 shadow-sm">
              <div className="flex items-center">
                <img src={peerAvatar} className="w-11 h-11 rounded-2xl mr-4 shadow-sm object-cover" alt={activePeer?.name} />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-none mb-1.5">{activePeer?.name}</h3>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{peerRole}</p>
                </div>
              </div>
              <ECallButton onClick={handleStartCall} disabled={!activeConversationKey} />
            </div>

            {error && <p className="text-xs text-rose-500 px-6 py-2">{error}</p>}

            <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto p-8 space-y-6 relative">
              {loadingChat && <p className="text-xs text-gray-400 text-center">Loading messages...</p>}
              {!loadingChat && activeMessages.length === 0 && (
                <p className="text-xs text-gray-400 text-center">No messages yet. Say hello!</p>
              )}
              {activeMessages.map((msg) => {
                const isMe = normalizeUserId(msg.senderId) === myUserId;
                return (
                  <div
                    key={String(msg._id || `${msg.sentAt}-${msg.text}`)}
                    className={`flex ${isMe ? 'justify-end' : 'items-start'} max-w-[80%] ${isMe ? 'ml-auto' : ''}`}
                  >
                    {!isMe && (
                      <img src={peerAvatar} className="w-8 h-8 rounded-xl mr-3 mt-1 shadow-xs object-cover" alt="" />
                    )}
                    <div>
                      <div
                        className={`p-4 rounded-2xl shadow-sm ${
                          isMe
                            ? 'bg-purple-600 text-white rounded-tr-none'
                            : 'bg-white border border-gray-100 rounded-tl-none'
                        }`}
                      >
                        <p className={`text-sm font-medium leading-relaxed ${isMe ? 'text-white' : 'text-gray-700'}`}>
                          {msg.text}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] font-bold text-gray-300 mt-2 block uppercase tracking-tighter ${
                          isMe ? 'text-right' : ''
                        }`}
                      >
                        {formatMessageTime(msg.sentAt)}
                        {isMe ? (
                          <span className={`ml-2 ${msg.isRead ? 'text-blue-500' : 'text-gray-400'}`}>
                            {msg.isRead ? '✓✓ Read' : '✓ Sent'}
                          </span>
                        ) : null}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="shrink-0 p-6 bg-white border-t border-gray-50 flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  disabled={sending}
                  className="w-full pl-6 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-sm focus:ring-1 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
              <button
                type="button"
                onClick={handleSend}
                disabled={sending || !messageText.trim()}
                className="shrink-0 w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-purple-100 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50"
              >
                <svg className="w-6 h-6 rotate-45 -mt-0.5 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;
