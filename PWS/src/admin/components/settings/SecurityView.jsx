import React, { useState } from 'react';
import Breadcrumb from './Breadcrumb';
import TwoFactorSection from '../../../components/security/twoFactorSection/twoFactorSection';

const SecurityView = ({ view, setView }) => {
  const [activeSecurityTab, setActiveSecurityTab] = useState('change-password');
  return (
  <div className="animate-fade-in max-w-6xl mx-auto pb-20">
    <Breadcrumb current="Password & Security" setView={setView} />
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50"><h3 className="text-xl font-bold text-gray-900 mb-6 font-serif">Password & Security</h3><p className="text-xs text-gray-400 leading-relaxed">Manage your passwords, login preferences and recovery methods.</p></div>
          <div className="flex flex-col">
            <button onClick={() => setActiveSecurityTab('change-password')} className={`w-full text-left p-6 flex items-center justify-between transition-colors ${activeSecurityTab === 'change-password' ? 'bg-purple-50/50 text-purple-600' : 'hover:bg-gray-25'}`}>
              <div className="flex items-center gap-4"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg><span className="text-sm font-bold">Change password</span></div>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            <button onClick={() => setActiveSecurityTab('2fa')} className={`w-full text-left p-6 flex items-center justify-between transition-colors border-t border-gray-50 ${activeSecurityTab === '2fa' ? 'bg-purple-50/50 text-purple-600' : 'hover:bg-gray-25'}`}>
              <div className="flex items-center gap-4"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg><span className="text-sm font-bold">Two-factor authentication</span></div>
              <div className="flex items-center gap-3"><span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase">Enabled</span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg></div>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm flex items-center justify-between"><span className="text-sm font-bold text-gray-700">Save login information</span><button className="w-11 h-6 rounded-full relative transition-colors bg-purple-900"><div className="w-4 h-4 rounded-full bg-white absolute top-1 right-1 shadow-sm"></div></button></div>
      </div>
      <div className="flex-1">
        {activeSecurityTab === 'change-password' ? (
          <div className="bg-white rounded-[2.5rem] p-12 border border-gray-50 shadow-sm animate-scale-in">
            <h3 className="text-3xl font-bold text-gray-900 mb-10 font-serif">Change password</h3>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-2xl flex items-start gap-5 mb-10"><div className="text-amber-600 pt-0.5"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div><p className="text-xs text-amber-900 font-medium leading-relaxed">You'll be logged out of all sessions except this one to protect your account if anyone is trying to gain access.</p></div>
            <div className="space-y-8"><p className="text-xs text-gray-400 max-w-md leading-relaxed">Your password must be at least 8 characters and should include a combination of numbers, letters and special characters (!@#%).</p><div className="space-y-6 max-w-lg"><div className="relative"><input type="password" placeholder="Current password" className="w-full px-6 py-4 bg-gray-25 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-purple-200 outline-none transition-all" /><button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button></div><div className="relative"><input type="password" placeholder="New password" className="w-full px-6 py-4 bg-gray-25 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-purple-200 outline-none transition-all" /><button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button></div><div className="relative"><input type="password" placeholder="Re-type new password" className="w-full px-6 py-4 bg-gray-25 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-purple-200 outline-none transition-all" /><button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button></div></div><button className="w-full max-w-lg py-5 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-[2rem] font-bold text-sm shadow-xl shadow-purple-200 hover:-translate-y-1 transition-all">Save</button></div>
          </div>
        ) : (
          <TwoFactorSection onComplete={() => {}} />
        )}
      </div>
    </div>
  </div>
)};

export default SecurityView;
