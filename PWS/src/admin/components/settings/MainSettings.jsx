import React from 'react';
import { useUser } from '../../../context/UserContext';

const settingsGroups = [
  {
    title: 'ADMIN ACCOUNT',
    items: [
      { name: 'Switch Accounts', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>, color: 'text-purple-600', action: 'switch-accounts' },
      { name: 'Admin Profile', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>, color: 'text-purple-600', action: 'profile' },
      { name: 'Notification Settings', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>, color: 'text-purple-600', action: 'notifications' },
      { name: 'Billing & Invoicing', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>, color: 'text-purple-600', action: 'billing' },
      { name: 'Platform Preferences', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>, color: 'text-purple-600', action: 'preferences' },
    ]
  },
  {
    title: 'SECURITY & SYSTEM',
    items: [
      { name: 'Password & Security', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>, color: 'text-purple-600', action: 'password-security' },
      { name: 'System Updates', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>, color: 'text-purple-600', action: 'app-updates' },
      { name: 'Data & Backups', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>, color: 'text-purple-600', action: 'data' },
    ]
  },
  {
    title: 'INFO',
    items: [
      { name: 'About PSW+ Admin', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, color: 'text-purple-600', action: 'about' },
    ]
  }
];

const MainSettings = ({ setView }) => {
  const { clearUser } = useUser();

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <div className="mb-10"><h2 className="text-4xl font-bold text-gray-900 mb-2 font-serif">Settings</h2><p className="text-gray-400 text-sm">Manage admin account, security, and platform configuration</p></div>
    <div className="relative mb-12"><span className="absolute inset-y-0 left-0 pl-4 flex items-center pt-0.5 pointer-events-none"><svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></span><input type="text" placeholder="Type to search settings..." className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-sm" /></div>
    <div className="space-y-12">{settingsGroups.map((group) => (<div key={group.title}><h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 ml-1">{group.title}</h3><div className="bg-white rounded-[1.5rem] border border-gray-50 shadow-sm overflow-hidden">{group.items.map((item, i) => (<button onClick={() => setView(item.action)} key={item.name} className={`w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group ${i !== group.items.length - 1 ? 'border-b border-gray-25' : ''}`}><div className="flex items-center gap-4"><div className={`${item.color} group-hover:scale-110 transition-transform`}>{item.icon}</div><span className="text-sm font-bold text-gray-700">{item.name}</span></div><svg className="w-4 h-4 text-gray-300 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg></button>))}</div></div>))}</div>
      <button onClick={() => { clearUser(); window.location.href = '/login'; }} className="w-full mt-12 py-5 bg-white border border-gray-100 rounded-[1.5rem] text-rose-600 font-bold text-sm shadow-sm hover:shadow-md transition-all">Logout</button>
    </div>
  );
};

export default MainSettings;
