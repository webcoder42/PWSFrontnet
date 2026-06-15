import React, { useState } from 'react';

const allMessages = {
  1: [
    { id: 1, from: 'them', text: "Good morning Admin! I've completed the visit with Jack Hudson. All vitals are normal, report submitted. ✅", time: '11:05 AM' },
    { id: 2, from: 'me', text: 'Great work Sarah! Please also note the medication change in the care plan for next visit.', time: '11:08 AM' },
    { id: 3, from: 'them', text: "Already updated! Also, the family requested a schedule change for next week — can you approve it from your end?", time: '11:10 AM' },
    { id: 4, from: 'me', text: "I'll review and approve it this afternoon. Thanks for the heads up 👍", time: '11:12 AM' },
    { id: 5, from: 'them', text: 'Client visit completed at 11am ✅', time: '11:15 AM' },
  ],
  2: [
    { id: 1, from: 'them', text: "Hi Admin, I was wondering if we could change my appointment to a later time slot next week?", time: '10:30 AM' },
    { id: 2, from: 'me', text: "Sure Jack, let me check Sarah's availability for next week. What time works better for you?", time: '10:45 AM' },
    { id: 3, from: 'them', text: "Afternoon would be ideal, around 2-3 PM if possible.", time: '10:50 AM' },
  ],
  3: [
    { id: 1, from: 'them', text: "Just submitted my shift report for the week. All 12 sessions completed on schedule 📋", time: 'Yesterday' },
    { id: 2, from: 'me', text: "Excellent work Emily! Your completion rate is outstanding this month.", time: 'Yesterday' },
  ],
  4: [
    { id: 1, from: 'them', text: "🔔 New PSW registration pending approval — Review required", time: 'Mon' },
    { id: 2, from: 'them', text: "🔔 3 PSW certifications expiring this month — Action needed", time: 'Mon' },
  ],
  5: [
    { id: 1, from: 'them', text: "Thank you for updating my schedule. The new time works perfectly for me.", time: 'Sun' },
    { id: 2, from: 'me', text: "Glad it works for you Mary! Sarah will be there at the new time.", time: 'Sun' },
  ],
};

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Sarah Johnson', role: 'PSW — Personal Care', status: 'On Shift', lastMsg: 'Client visit completed at 11am ✅', time: '3m ago', unread: 2, seed: 'Sarah' },
    { id: 2, name: 'Jack Hudson', role: 'Client — Alzheimer\'s', status: 'Online', lastMsg: 'Can we get a different time slot?', time: '15m ago', unread: 3, seed: 'Jack' },
    { id: 3, name: 'Emily Davis', role: 'PSW — Physiotherapy', status: 'Online', lastMsg: 'Submitted my shift report 📋', time: 'Yesterday', unread: 0, seed: 'Emily' },
    { id: 4, name: 'System Alerts', role: 'Platform Notifications', status: 'Active', lastMsg: 'New PSW registration pending approval', time: 'Mon', unread: 0, seed: 'Support' },
    { id: 5, name: 'Mary Wilson', role: 'Client — Palliative', status: 'Offline', lastMsg: 'Thank you for the schedule update', time: 'Sun', unread: 0, seed: 'Mary' },
  ]);
  const [chatMessages, setChatMessages] = useState(allMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);

  const currentChat = conversations.find(c => c.id === selectedConversation);
  const currentMessages = chatMessages[selectedConversation] || [];
  const filteredConversations = conversations.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSend = () => {
    if (!messageText.trim()) return;
    const newMsg = { id: Date.now(), from: 'me', text: messageText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => ({ ...prev, [selectedConversation]: [...(prev[selectedConversation] || []), newMsg] }));
    setConversations(prev => prev.map(c => c.id === selectedConversation ? { ...c, lastMsg: messageText, time: 'Just now' } : c));
    setMessageText('');
  };

  const handleSelectConversation = (id) => {
    setSelectedConversation(id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
    setShowMobileChat(true);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden animate-in fade-in duration-700">
      {/* Sidebar - Conversation List */}
      <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-gray-50 flex-col h-full bg-white relative z-10`}>
        <div className="p-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Messages</h2>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pt-0.5">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </span>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search PSWs, clients..." className="pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs w-full focus:ring-1 focus:ring-purple-200 outline-none transition-all" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 px-3 pb-6">
          {filteredConversations.map((conv) => (
            <button key={conv.id} onClick={() => handleSelectConversation(conv.id)}
              className={`w-full p-4 rounded-2xl flex items-center transition-all mb-1 text-left ${
                selectedConversation === conv.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-100 scale-[1.02]'
                  : 'hover:bg-gray-50 text-gray-900'
              }`}>
              <div className="relative shrink-0">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.seed}`} className={`w-12 h-12 rounded-2xl object-cover ring-2 ${selectedConversation === conv.id ? 'ring-purple-400' : 'ring-gray-100'}`} alt={conv.name} />
                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 ${selectedConversation === conv.id ? 'border-purple-600' : 'border-white'} ${conv.status === 'Offline' ? 'bg-gray-300' : 'bg-emerald-500'}`}></div>
              </div>
              <div className="ml-4 flex-1 min-w-0 pr-2">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className={`text-sm font-bold truncate ${selectedConversation === conv.id ? 'text-white' : 'text-gray-900'}`}>{conv.name}</h4>
                  <span className={`text-[10px] font-medium shrink-0 ${selectedConversation === conv.id ? 'text-purple-200' : 'text-gray-400'}`}>{conv.time}</span>
                </div>
                <p className={`text-[10px] truncate leading-tight ${selectedConversation === conv.id ? 'text-purple-100' : 'text-gray-500 font-medium'}`}>{conv.lastMsg}</p>
              </div>
              {conv.unread > 0 && selectedConversation !== conv.id && (
                <div className="bg-purple-600 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-sm">{conv.unread}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`${showMobileChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col h-full bg-gray-25/30 relative`}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

        <div className="p-4 md:p-6 border-b border-gray-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            <button onClick={() => setShowMobileChat(false)} className="md:hidden p-2 mr-2 hover:bg-gray-50 rounded-xl text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentChat?.seed}`} className="w-11 h-11 rounded-2xl mr-4 shadow-sm" alt={currentChat?.name} />
            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-none mb-1.5">{currentChat?.name}</h3>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 shadow-xs ring-4 ${currentChat?.status === 'Offline' ? 'bg-gray-300 ring-gray-50' : 'bg-emerald-500 ring-emerald-50'}`}></div>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${currentChat?.status === 'Offline' ? 'text-gray-400' : 'text-emerald-600'}`}>{currentChat?.status || 'Online'}</p>
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
          <div className="flex justify-center mb-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100/50 px-4 py-1.5 rounded-full">Today</span>
          </div>

          {currentMessages.map((msg) => (
            msg.from === 'me' ? (
              <div key={msg.id} className="flex flex-col items-end">
                <div className="max-w-[80%]">
                  <div className="bg-purple-600 p-5 rounded-2xl rounded-tr-none shadow-lg shadow-purple-100">
                    <p className="text-sm font-medium text-white leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[9px] font-bold text-gray-300 mt-2 mr-1 block text-right uppercase tracking-tighter">{msg.time}</span>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex items-start max-w-[80%]">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentChat?.seed}`} className="w-8 h-8 rounded-xl mr-3 mt-1 shadow-xs" alt="" />
                <div>
                  <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[9px] font-bold text-gray-300 mt-2 ml-1 block uppercase tracking-tighter">{msg.time}</span>
                </div>
              </div>
            )
          ))}
        </div>

        <div className="p-4 md:p-6 bg-white border-t border-gray-50 flex items-center space-x-3 md:space-x-4">
          <button className="shrink-0 p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:text-purple-600 transition-all border border-gray-100 shadow-xs">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="w-full pl-6 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-sm focus:ring-1 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
          <button onClick={handleSend} className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-95 group ${messageText.trim() ? 'bg-purple-600 shadow-purple-100 hover:scale-105' : 'bg-gray-300 cursor-not-allowed'}`}>
            <svg className="w-6 h-6 rotate-45 -mt-0.5 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
