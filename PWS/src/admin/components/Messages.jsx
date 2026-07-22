import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminConversationsAPI, fetchAdminConversationByKeyAPI } from '../../utils/adminApi';

const getName = (user) => {
  if (!user) return 'Unknown';
  const full = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  return full || user.role || 'Unknown';
};

const getAvatarUrl = (user, fallbackSeed) => {
  const url = user?.photoUrl?.trim();
  if (url) return url;
  const seed = encodeURIComponent(fallbackSeed || getName(user) || 'Chat');
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};

const formatTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Messages = () => {
  const [selectedKey, setSelectedKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const hasAutoSelected = useRef(false);

  const { data: conversations = [], isLoading, error: listError } = useQuery({
    queryKey: ['admin', 'conversations'],
    queryFn: () => fetchAdminConversationsAPI().then(r => (Array.isArray(r.data) ? r.data : [])),
  });

  useEffect(() => {
    if (conversations.length > 0 && !hasAutoSelected.current) {
      setSelectedKey(conversations[0].conversationKey);
      hasAutoSelected.current = true;
    }
  }, [conversations]);

  const { data: currentConversation, isLoading: loadingConversation, error: convError } = useQuery({
    queryKey: ['admin', 'conversation', selectedKey],
    queryFn: () => fetchAdminConversationByKeyAPI(selectedKey).then(r => r.data || null),
    enabled: !!selectedKey,
  });

  const error = listError || convError;

  const filteredConversations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return conversations;
    return conversations.filter((conv) => {
      const clientName = getName(conv.clientId).toLowerCase();
      const pswName = getName(conv.pswId).toLowerCase();
      const preview = (conv.messages?.[conv.messages.length - 1]?.text || '').toLowerCase();
      return clientName.includes(term) || pswName.includes(term) || preview.includes(term);
    });
  }, [searchTerm, conversations]);

  const currentChat = useMemo(() => {
    if (!currentConversation) return null;
    const clientName = getName(currentConversation.clientId);
    const pswName = getName(currentConversation.pswId);
    return {
      name: `${pswName} ↔ ${clientName}`,
      seed: getName(currentConversation.pswId) || getName(currentConversation.clientId) || 'Chat',
      status: currentConversation.activeCallId ? 'In Call' : 'Monitoring',
      messages: Array.isArray(currentConversation.messages) ? currentConversation.messages : [],
    };
  }, [currentConversation]);

  const openConversation = (conversationKey) => {
    if (!conversationKey) return;
    setSelectedKey(conversationKey);
    setShowMobileChat(true);
  };

  const renderConversationRows = () => {
    if (isLoading) {
      return <p className="text-xs text-gray-400 text-center">Loading conversations...</p>;
    }

    if (filteredConversations.length === 0) {
      return <p className="text-xs text-gray-400 text-center">No conversations match your search.</p>;
    }

    return filteredConversations.map((conv) => {
      const clientName = getName(conv.clientId);
      const pswName = getName(conv.pswId);
      const lastMessage = Array.isArray(conv.messages) && conv.messages.length > 0
        ? conv.messages[conv.messages.length - 1]
        : null;
      const preview = lastMessage?.text || 'No messages yet';
      const time = lastMessage?.sentAt ? new Date(lastMessage.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
      const isSelected = selectedKey === conv.conversationKey;
      const seed = getName(conv.pswId) || getName(conv.clientId) || 'Chat';

      const avatarUrl = getAvatarUrl(conv.pswId || conv.clientId, seed);
      return (
        <button
          key={conv.conversationKey}
          onClick={() => openConversation(conv.conversationKey)}
          className={`w-full p-4 rounded-2xl flex items-center transition-all mb-1 text-left ${isSelected ? 'bg-purple-600 text-white shadow-lg shadow-purple-100 scale-[1.02]' : 'hover:bg-gray-50 text-gray-900'}`}>
          <div className="relative shrink-0">
            <img src={avatarUrl} className={`w-12 h-12 rounded-2xl object-cover ring-2 ${isSelected ? 'ring-purple-400' : 'ring-gray-100'}`} alt={pswName} />
            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 ${isSelected ? 'border-purple-600' : 'border-white'} bg-emerald-500`} />
          </div>
          <div className="ml-4 flex-1 min-w-0 pr-2">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>{pswName} ↔ {clientName}</h4>
              <span className={`text-[10px] font-medium shrink-0 ${isSelected ? 'text-purple-200' : 'text-gray-400'}`}>{time}</span>
            </div>
            <p className={`text-[10px] truncate leading-tight ${isSelected ? 'text-purple-100' : 'text-gray-500 font-medium'}`}>{preview}</p>
          </div>
        </button>
      );
    });
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden animate-in fade-in duration-700">
      <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-gray-50 flex-col h-full bg-white relative z-10`}>
        <div className="p-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Messages</h2>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pt-0.5">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search PSWs, clients..."
              className="pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs w-full focus:ring-1 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 px-3 pb-6">
          {renderConversationRows()}
        </div>
      </div>

      <div className={`${showMobileChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col h-full bg-gray-25/30 relative`}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        <div className="p-4 md:p-6 border-b border-gray-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            <button onClick={() => setShowMobileChat(false)} className="md:hidden p-2 mr-2 hover:bg-gray-50 rounded-xl text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <img src={getAvatarUrl(currentConversation?.pswId || currentConversation?.clientId, currentChat?.seed)} className="w-11 h-11 rounded-2xl mr-4 shadow-sm object-cover" alt={currentChat?.name || 'Conversation'} />
            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-none mb-1.5">{currentChat?.name || 'Select a conversation'}</h3>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 shadow-xs ring-4 ${currentChat?.status === 'Monitoring' ? 'bg-emerald-500 ring-emerald-50' : 'bg-gray-300 ring-gray-50'}`} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{currentChat?.status || 'Monitoring'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all border border-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            </button>
            <button className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all border border-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 relative">
          {loadingConversation && <p className="text-xs text-gray-400 text-center">Loading conversation...</p>}
          {error && !loadingConversation && <p className="text-xs text-rose-500 text-center">{error instanceof Error ? error.message : 'Unable to load messages.'}</p>}
          {!loadingConversation && !currentConversation && !error && (
            <p className="text-xs text-gray-400 text-center">Select a conversation from the left to inspect the full chat history.</p>
          )}

          {!loadingConversation && currentConversation && currentChat?.messages.length === 0 && (
            <p className="text-xs text-gray-400 text-center">No messages yet in this conversation.</p>
          )}

          {!loadingConversation && currentConversation && currentChat?.messages.map((msg) => {
            const sender = msg.senderRole === 'care_provider' ? currentConversation.pswId : currentConversation.clientId;
            const senderName = getName(sender);
            const avatarUrl = getAvatarUrl(sender, senderName);
            const isProvider = msg.senderRole === 'care_provider';

            return (
              <div key={`${msg._id ?? msg.sentAt}-${msg.text}`} className={`flex ${isProvider ? 'items-start' : 'items-start flex-row-reverse'} gap-3`}>
                <img src={avatarUrl} className="w-10 h-10 rounded-2xl shadow-sm object-cover" alt={senderName} />
                <div className="max-w-[80%]">
                  <div className={`${isProvider ? 'bg-white border border-gray-100 text-gray-700' : 'bg-purple-600 text-white'} p-5 rounded-2xl shadow-sm`}>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.16em] mb-2">{senderName}</p>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 mt-2 block uppercase tracking-tighter">{formatTime(msg.sentAt)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 md:p-6 bg-white border-t border-gray-50 text-xs text-gray-500">
          Admin monitoring mode: this screen shows the stored chat history for the selected conversation.
        </div>
      </div>
    </div>
  );
};

export default Messages;
