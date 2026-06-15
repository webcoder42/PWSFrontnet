import React, { useState, useRef, useEffect } from 'react';
import pswPlusLogo from '../assets/PSW+ Logo.png';
import { useUser } from '../../context/UserContext';

const Layout = ({ children, activeTab, onTabChange, onLogout }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const { profile } = useUser();

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New PSW registration', desc: 'Emily Davis submitted a new application', time: '3m ago', unread: true, icon: '👤' },
    { id: 2, title: 'Assignment conflict', desc: 'Sarah Johnson has overlapping shifts on Mar 18', time: '15m ago', unread: true, icon: '⚠️' },
    { id: 3, title: 'Client feedback received', desc: 'Jack Hudson rated his last session 5 stars', time: '1h ago', unread: true, icon: '⭐' },
    { id: 4, title: 'Shift report submitted', desc: 'Michael Chen completed shift documentation', time: '2h ago', unread: false, icon: '📋' },
    { id: 5, title: 'System maintenance', desc: 'Scheduled downtime tonight 2:00 AM - 3:00 AM', time: '3h ago', unread: false, icon: '🔧' },
    { id: 6, title: 'Billing update', desc: 'March invoices have been processed', time: '5h ago', unread: false, icon: '💰' },
    { id: 7, title: 'New compliance alert', desc: 'Annual certification renewal due for 3 PSWs', time: '1d ago', unread: false, icon: '🛡️' },
  ]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  // Close mobile sidebar on tab change
  const handleTabChange = (name, subView = 'main') => {
    onTabChange(name, subView);
    setIsMobileSidebarOpen(false);
  };

  const profileName = profile?.name || 'Admin';
  const profileEmail = profile?.email || 'No email available';
  const profileRole = profile?.role ? profile.role.replace(/_/g, ' ') : 'admin';


  const sidebarItems = [
    { name: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { name: 'Clients', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    { name: 'PSWs', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { name: 'Users', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-6 0v2zm-8 0h6v-2a3 3 0 00-6 0v2zm5-10a3 3 0 11-6 0 3 3 0 016 0zm-6 8a5 5 0 00-5 5h10a5 5 0 00-5-5z" /></svg> },
    { name: 'Appointments', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { name: 'Compliance', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
    { name: 'Billing', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
    { name: 'Reports', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { name: 'Messages', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> },
    { name: 'Support', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    { name: 'Content', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg> },
    { name: 'Learning Hub', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
    { name: 'Settings', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  const renderSidebarContent = (isMobile = false) => (
    <>
      <div className={`p-6 flex items-center justify-between ${isSidebarCollapsed && !isMobile ? 'flex-col gap-4' : ''}`}>
        <button onClick={() => handleTabChange('Dashboard')} className="flex items-center hover:opacity-80 transition-opacity">
          <img src={pswPlusLogo} className={`${isSidebarCollapsed && !isMobile ? 'h-8 w-8' : 'w-24'} object-contain transition-all`} alt="PSW+" />
        </button>
        {!isMobile && (
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-purple-600 transition-colors">
            <svg className={`w-5 h-5 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
          </button>
        )}
        {isMobile && (
          <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
        {sidebarItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleTabChange(item.name)}
            className={`w-full flex items-center ${isSidebarCollapsed && !isMobile ? 'justify-center px-0' : 'space-x-3 px-4'} py-3 rounded-xl transition-all duration-200 group relative ${
              activeTab === item.name
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <div className={`${activeTab === item.name ? 'text-white' : 'text-gray-400 group-hover:text-purple-500'} transition-colors shrink-0`}>
              {item.icon}
            </div>
            {(!isSidebarCollapsed || isMobile) && (
              <span className="font-medium text-sm whitespace-nowrap">{item.name}</span>
            )}
            {isSidebarCollapsed && !isMobile && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold whitespace-nowrap z-50 shadow-xl">
                {item.name}
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-gray-100">
        <button onClick={() => { handleTabChange('Settings'); }} className={`w-full flex items-center ${isSidebarCollapsed && !isMobile ? 'justify-center' : 'space-x-3'} bg-gray-50 p-3 rounded-xl transition-all hover:bg-gray-100`}>
          {profile?.photoUrl ? (
            <img src={profile.photoUrl} alt={profileName} className="w-10 h-10 rounded-full border-2 border-white shadow-sm shrink-0 object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm shrink-0 bg-purple-600 text-white flex items-center justify-center text-xs font-extrabold">
              {profile?.initials || 'A'}
            </div>
          )}
          {(!isSidebarCollapsed || isMobile) && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-bold truncate">{profileName}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{profileRole}</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-gray-800 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex ${isSidebarCollapsed ? 'w-24' : 'w-64'} bg-white border-r border-gray-100 flex-col shrink-0 transition-all duration-300 ease-in-out`}>
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)}></div>
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col animate-slide-in z-10">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 flex-shrink-0 bg-white/50 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-4 md:px-10 z-10">
          {/* Mobile hamburger + logo */}
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-50 rounded-xl text-gray-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <button onClick={() => handleTabChange('Dashboard')} className="hover:opacity-80 transition-opacity">
              <img src={pswPlusLogo} className="h-8 object-contain lg:hidden" alt="PSW+" />
            </button>
            <button onClick={() => handleTabChange('Dashboard')} className="hidden lg:block text-left hover:opacity-80 transition-opacity">
              <h1 className="text-lg font-bold flex items-center gap-2">Admin Dashboard <span className="text-lg">🛡️</span></h1>
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest leading-none">PSW+ Management Console</p>
            </button>
          </div>

          <div className="flex items-center space-x-3 md:space-x-5">
            {/* Search */}
            <div className="relative hidden sm:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pt-0.5 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search clients, PSWs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-gray-100 border-none rounded-xl focus:ring-1 focus:ring-purple-500 w-48 lg:w-64 text-xs outline-none" 
              />
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }} className="relative p-2 bg-white rounded-xl shadow-sm border border-gray-50 flex-shrink-0 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-rose-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white font-bold">{notifications.filter(n => n.unread).length}</span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                  <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    <div className="flex gap-4">
                      <button onClick={markAllRead} className="text-[10px] font-bold text-purple-600 uppercase tracking-widest hover:underline">Mark all read</button>
                      <button onClick={clearNotifications} className="text-[10px] font-bold text-rose-600 uppercase tracking-widest hover:underline">Clear all</button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-10 text-center">
                        <p className="text-gray-400 text-xs font-medium">No new notifications</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <button 
                          key={n.id} 
                          onClick={() => handleNotificationClick(n.id)}
                          className={`w-full flex items-start gap-4 p-4 hover:bg-gray-25 transition-colors text-left border-b border-gray-25 last:border-0 ${n.unread ? 'bg-purple-25/30' : ''}`}
                        >
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-lg shrink-0 mt-0.5">{n.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-900 truncate">{n.title}</p>
                            {n.unread && <div className="w-2 h-2 bg-purple-600 rounded-full shrink-0"></div>}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{n.desc}</p>
                          <p className="text-[10px] text-gray-300 mt-1 font-bold">{n.time}</p>
                        </div>
                      </button>
                    ))
                  )}
                  </div>
                  <div className="p-4 border-t border-gray-50">
                    <button onClick={() => { setShowNotifications(false); onTabChange('Messages'); }} className="w-full text-center text-xs font-bold text-purple-600 hover:underline py-2">View All Notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar + Dropdown */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }} className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-1 pr-2 transition-colors">
                {profile?.photoUrl ? (
                  <img src={profile.photoUrl} alt={profileName} className="w-10 h-10 rounded-xl shadow-md border-2 border-white flex-shrink-0 object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-xl shadow-md border-2 border-white flex-shrink-0 bg-purple-600 text-white flex items-center justify-center text-xs font-extrabold">
                    {profile?.initials || 'A'}
                  </div>
                )}
                <svg className={`w-4 h-4 text-gray-400 hidden md:block transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                  <div className="p-5 border-b border-gray-50 flex items-center gap-4">
                    {profile?.photoUrl ? (
                      <img src={profile.photoUrl} className="w-12 h-12 rounded-xl border-2 border-purple-100 object-cover" alt={profileName} />
                    ) : (
                      <div className="w-12 h-12 rounded-xl border-2 border-purple-100 bg-purple-600 text-white flex items-center justify-center text-sm font-extrabold">
                        {profile?.initials || 'A'}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{profileName}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{profileEmail}</p>
                    </div>
                  </div>
                  <div className="py-2">
                    <button onClick={() => { setShowProfileMenu(false); handleTabChange('Settings', 'profile'); }} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      My Profile
                    </button>
                    <button onClick={() => { setShowProfileMenu(false); handleTabChange('Settings', 'main'); }} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Settings
                    </button>
                    <button onClick={() => { setShowProfileMenu(false); onTabChange('Messages'); }} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                      Messages
                    </button>
                  </div>
                  <div className="border-t border-gray-50 py-2">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
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
