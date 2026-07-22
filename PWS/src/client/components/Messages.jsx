import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useChatRealtime } from '../hooks/useChatRealtime';
import {
  getChatConversationAPI,
  listChatConversationsAPI,
  readAuthToken,
  sendChatMessageAPI,
} from '../utils/chatApi';
import { getChatSocket, subscribeChatMessages } from '../utils/chatSocket';
import {
  appendMessageIfNew,
  avatarFallback,
  countUnreadMessages,
  formatConversationTime,
  formatMessageTime,
  getLastMessagePreview,
  getOtherParticipant,
  normalizeUserId,
} from '../utils/chatHelpers';

const Messages = () => {
  const { user } = useUser();
  const myUserId = normalizeUserId(user?._id) || normalizeUserId(user?.id) || '';

  const [conversations, setConversations] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [messages, setMessages] = useState([]);
  const [peer, setPeer] = useState({ name: '', photoUrl: '', role: '' });
  const [messageText, setMessageText] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

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

  const loadConversations = useCallback(async () => {
    if (!readAuthToken()) {
      setError('Please log in to use messages. (auth token required in localStorage)');
      setLoadingList(false);
      return;
    }
    setLoadingList(true);
    setError('');
    try {
      const res = await listChatConversationsAPI();
      const list = Array.isArray(res.data) ? res.data : [];
      setConversations(list);
      setSelectedKey((prev) => prev || (list.length > 0 ? list[0].conversationKey : null));
    } catch (err) {
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoadingList(false);
    }
  }, []);

  const applyConversation = useCallback(
    (conv) => {
      const other = getOtherParticipant(conv, myUserId);
      setPeer({
        name: other.name,
        photoUrl: other.photoUrl || avatarFallback(other.name),
        role: other.role === 'care_provider' ? 'PSW · Care Provider' : 'Client',
      });
      setMessages(Array.isArray(conv.messages) ? conv.messages : []);
    },
    [myUserId],
  );

  const loadSelectedConversation = useCallback(async () => {
    if (!selectedKey) return;
    setLoadingChat(true);
    try {
      const res = await getChatConversationAPI(selectedKey);
      applyConversation(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load chat');
    } finally {
      setLoadingChat(false);
    }
  }, [applyConversation, selectedKey]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    loadSelectedConversation();
  }, [loadSelectedConversation]);

  useEffect(() => {
    if (!loadingChat) scrollToBottom('auto');
  }, [selectedKey, loadingChat, scrollToBottom]);

  useEffect(() => {
    if (!loadingChat) scrollToBottom('smooth');
  }, [messages, loadingChat, scrollToBottom]);

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
    if (!readAuthToken()) return undefined;
    getChatSocket().catch(() => {});
    return subscribeChatMessages((payload) => {
      upsertConversationFromSocket(payload);
    });
  }, [upsertConversationFromSocket]);

  useChatRealtime({
    conversationKey: selectedKey,
    enabled: Boolean(selectedKey),
    onMessage: (incoming) => {
      setMessages((prev) => appendMessageIfNew(prev, incoming));
      scrollToBottom();
    },
  });

  const handleSend = async (e) => {
    e?.preventDefault?.();
    const text = messageText.trim();
    if (!text || !selectedKey || sending) return;
    setSending(true);
    try {
      const res = await sendChatMessageAPI(selectedKey, text);
      setMessageText('');
      const newMessage = res?.data?.message;
      if (newMessage) {
        setMessages((prev) => appendMessageIfNew(prev, newMessage));
      }
    } catch (err) {
      setError(err.message || 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden animate-in fade-in duration-700">
      <div className={`${showMobileChat ? 'hidden' : 'flex'} md:flex w-full md:w-80 border-r border-gray-50 flex-col h-full bg-white relative z-10`}>
        <div className="p-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Messages</h2>
          {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 px-3 pb-6">
          {loadingList ? (
            <p className="text-center text-sm text-gray-400 py-8">Loading conversations...</p>
          ) : conversations.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8 px-4">
              No conversations yet. Start a chat from the app with a care provider.
            </p>
          ) : (
            conversations.map((conv) => {
              const other = getOtherParticipant(conv, myUserId);
              const isActive = conv.conversationKey === selectedKey;
              const unread = countUnreadMessages(conv.messages, myUserId);
              return (
                <button
                  key={conv.conversationKey}
                  type="button"
                  onClick={() => { setSelectedKey(conv.conversationKey); setShowMobileChat(true); }}
                  className={`w-full p-4 rounded-2xl flex items-center transition-all mb-1 text-left ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-100 scale-[1.02]'
                      : 'hover:bg-gray-50 text-gray-900'
                  }`}
                >
                  <img
                    src={other.photoUrl || avatarFallback(other.name)}
                    className={`w-12 h-12 rounded-2xl object-cover ring-2 ${
                      isActive ? 'ring-purple-400' : 'ring-gray-100'
                    }`}
                    alt={other.name}
                  />
                  <div className="ml-4 flex-1 min-w-0 pr-2">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4
                        className={`text-sm font-bold truncate ${
                          isActive ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {other.name}
                      </h4>
                      <span
                        className={`text-[10px] font-medium shrink-0 ${
                          isActive ? 'text-purple-200' : 'text-gray-400'
                        }`}
                      >
                        {formatConversationTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p
                      className={`text-[10px] truncate leading-tight ${
                        isActive ? 'text-purple-100' : 'text-gray-500 font-medium'
                      }`}
                    >
                      {getLastMessagePreview(conv)}
                    </p>
                  </div>
                  {unread > 0 && !isActive && (
                    <div className="bg-purple-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                      {unread}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className={`${!selectedKey ? 'flex' : showMobileChat ? 'flex' : 'hidden'} md:flex flex-1 flex-col h-full bg-gray-25/30 relative`}>
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {!selectedKey ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a conversation
          </div>
        ) : (
          <>
            <div className="p-4 md:p-6 border-b border-gray-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
              <div className="flex items-center">
                <button onClick={() => setShowMobileChat(false)} className="md:hidden p-2 mr-2 hover:bg-gray-50 rounded-xl text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <img src={peer.photoUrl} className="w-11 h-11 rounded-2xl mr-4 shadow-sm" alt={peer.name} />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-none mb-1.5">{peer.name}</h3>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{peer.role}</p>
                </div>
              </div>
            </div>

            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 relative">
              {loadingChat ? (
                <p className="text-center text-sm text-gray-400">Loading messages...</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-sm text-gray-400">No messages yet. Say hello!</p>
              ) : (
                messages.map((msg) => {
                  const isMe = normalizeUserId(msg.senderId) === myUserId;
                  return (
                    <div
                      key={String(msg._id || `${msg.sentAt}-${msg.text}`)}
                      className={`flex ${isMe ? 'justify-end' : 'items-start max-w-[80%]'}`}
                    >
                      {!isMe && (
                        <img
                          src={peer.photoUrl}
                          className="w-8 h-8 rounded-xl mr-3 mt-1 shadow-xs shrink-0"
                          alt={peer.name}
                        />
                      )}
                      <div className={isMe ? 'max-w-[80%]' : ''}>
                        <div
                          className={`p-5 rounded-2xl shadow-sm ${
                            isMe
                              ? 'bg-purple-600 text-white rounded-tr-none shadow-purple-100'
                              : 'bg-white border border-gray-100 rounded-tl-none'
                          }`}
                        >
                          <p
                            className={`text-sm font-medium leading-relaxed ${
                              isMe ? 'text-white' : 'text-gray-700'
                            }`}
                          >
                            {msg.text}
                          </p>
                        </div>
                        <span
                          className={`text-[9px] font-bold text-gray-300 mt-2 block uppercase tracking-tighter ${
                            isMe ? 'text-right mr-1' : 'ml-1'
                          }`}
                        >
                          {formatMessageTime(msg.sentAt)}
                          {isMe ? (msg.isRead ? ' · Read' : ' · Sent') : ''}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="p-4 md:p-6 bg-white border-t border-gray-50 flex items-center space-x-3 md:space-x-4"
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  disabled={sending}
                  className="w-full pl-4 md:pl-6 pr-12 py-3 md:py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-sm focus:ring-1 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={sending || !messageText.trim()}
                className="shrink-0 w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-purple-100 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50"
              >
                <svg
                  className="w-6 h-6 rotate-45 -mt-0.5 -ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;
