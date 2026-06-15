import React, { useState } from 'react';
import pswPlusLogo from '../assets/PSW+ Logo.png';
import { useUser } from '../../context/UserContext';
import { useNotificationCenter } from '../../context/NotificationCenterContext';

const Layout = ({ children, activeTab, onTabChange }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { profile } = useUser();
  const { notifications, unreadCount, markRead, markAllRead, removeNotification } = useNotificationCenter();
  const unreadNotifications = notifications.filter((item) => !item.read);

  const formatAgo = (iso) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    const diff = Date.now() - date.getTime();
    if (diff < 60_000) return 'Just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const sidebarItems = [
    { name: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { name: 'Appointments', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { name: 'Reports', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { name: 'Messages', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    )},
    { name: 'Learning Hub', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
    { name: 'Settings', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ];

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-gray-800 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className={`hidden lg:flex ${isSidebarCollapsed ? 'w-24' : 'w-64'} bg-white border-r border-gray-100 flex-col shrink-0 transition-all duration-300 ease-in-out`}>
        <div className={`p-6 flex items-center justify-between ${isSidebarCollapsed ? 'flex-col gap-4' : ''}`}>
          <div className="flex items-center">
            <img 
              src={pswPlusLogo} 
              className={`${isSidebarCollapsed ? 'h-8 w-8' : 'w-24'} object-contain transition-all`} 
              alt="PSW+" 
            />
          </div>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-purple-600 transition-colors"
          >
            <svg className={`w-5 h-5 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => onTabChange(item.name)}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'space-x-3 px-4'} py-3 rounded-xl transition-all duration-200 group relative ${
                activeTab === item.name 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <div className={`${activeTab === item.name ? 'text-white' : 'text-gray-400 group-hover:text-purple-500'} transition-colors shrink-0`}>
                {item.icon}
              </div>
              {!isSidebarCollapsed && (
                <span className="font-medium text-sm whitespace-nowrap animate-fade-in">{item.name}</span>
              )}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold whitespace-nowrap z-50 shadow-xl">
                   {item.name}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-100">
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'} bg-gray-50 p-3 rounded-xl transition-all`}>
            {profile?.photoUrl ? (
              <img 
                src={profile.photoUrl} 
                alt={profile.name || 'User'} 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm shrink-0 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm shrink-0 bg-purple-600 text-white flex items-center justify-center font-extrabold text-xs">
                {profile?.initials || 'U'}
              </div>
            )}
            {!isSidebarCollapsed && (
              <>
                <div className="flex-1 min-w-0 animate-fade-in">
                  <p className="text-sm font-bold truncate">{profile?.name || 'User'}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (Shared) */}
        <header className="h-20 flex-shrink-0 bg-white/50 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-4 md:px-10 z-10">
          <div className="flex items-center lg:hidden">
             <img src={pswPlusLogo} className="h-8 object-contain" alt="PSW+" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-bold flex items-center gap-2">
              Hi, {profile?.name || 'User'} <span className="text-lg">👋</span>
            </h1>
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest leading-none">Good morning</p>
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="relative hidden sm:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pt-0.5 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </span>
              <input type="text" placeholder="Search" className="pl-9 pr-4 py-1.5 bg-gray-100 border-none rounded-xl focus:ring-1 focus:ring-purple-500 w-48 lg:w-64 text-xs" />
            </div>
            
            <div className="relative">
            <button onClick={() => setIsNotificationsOpen((prev) => !prev)} className="relative p-2 bg-white rounded-xl shadow-sm border border-gray-50 flex-shrink-0">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            </button>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[14px] h-3.5 px-1 bg-rose-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 max-h-[420px] overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-2xl z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900">Notifications</p>
                  <button onClick={markAllRead} className="text-[11px] font-bold text-purple-600">Mark all read</button>
                </div>
                {unreadNotifications.length === 0 ? (
                  <div className="p-5 text-center text-xs text-gray-400 font-semibold">No new notifications</div>
                ) : (
                  <div className="max-h-[340px] overflow-y-auto p-2 space-y-2">
                    {unreadNotifications.slice(0, 20).map((item) => (
                      <div key={item.id} className="rounded-xl p-3 bg-purple-50">
                        <button
                          className="w-full text-left"
                          onClick={() => {
                            markRead(item.id);
                            setIsNotificationsOpen(false);
                            if (item.type === 'chat_message') onTabChange('Messages');
                            if (item.type === 'appointment_update') onTabChange('Appointments');
                          }}
                        >
                          <p className="text-xs font-bold text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{item.body}</p>
                          <p className="text-[10px] text-gray-400 mt-2 font-semibold">{formatAgo(item.createdAt)}</p>
                        </button>
                        <button
                          className="text-[10px] text-gray-400 font-bold mt-2"
                          onClick={() => removeNotification(item.id)}
                        >
                          Dismiss
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            </div>
            {profile?.photoUrl ? (
              <img src={profile.photoUrl} alt={profile.name || 'User'} className="w-10 h-10 rounded-xl shadow-md border-2 border-white flex-shrink-0 object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-xl shadow-md border-2 border-white flex-shrink-0 bg-purple-600 text-white flex items-center justify-center font-extrabold text-xs">
                {profile?.initials || 'U'}
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#F9FAFB]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
