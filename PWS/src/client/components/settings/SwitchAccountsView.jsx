import React from 'react';
import { useUser } from '../../context/UserContext';
import Breadcrumb from './Breadcrumb';

const SwitchAccountsView = ({ setView }) => {
  const { user } = useUser();
  const userFullName = `${user?.firstName || 'User'} ${user?.lastName || ''}`;
  
  return (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="Switch Accounts" setView={setView} />
    <div className="mb-12"><h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 ml-1">Your Account</h3><div className="bg-white rounded-[2rem] border-2 border-purple-100 p-8 flex items-center justify-between shadow-xl shadow-purple-50"><div className="flex items-center gap-6"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName || 'User'}`} className="w-16 h-16 rounded-2xl border-4 border-white shadow-sm" alt={userFullName} /><div><h4 className="font-bold text-gray-900 text-lg">{userFullName}</h4><p className="text-sm text-gray-400">{user?.email || 'N/A'}</p></div></div><div className="text-purple-600"><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg></div></div></div>
    <div><h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 ml-1">Other Accounts</h3><div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden divide-y divide-gray-25"><div className="p-8 flex items-center justify-between hover:bg-gray-25 transition-all cursor-pointer group"><div className="flex items-center gap-6"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="w-16 h-16 rounded-2xl border-4 border-white shadow-sm" alt="Sarah" /><div><h4 className="font-bold text-gray-900 text-lg">Sarah Johnson</h4><p className="text-sm text-gray-400">sarahjohnson@gmail.com</p></div></div></div><button className="w-full p-8 flex items-center justify-between hover:bg-gray-25 transition-all group"><div className="flex items-center gap-6 text-purple-600"><div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center font-bold text-xl">+</div><span className="font-bold text-sm text-gray-700">Add Account</span></div><svg className="w-4 h-4 text-gray-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg></button></div></div>
  </div>
  );
};

export default SwitchAccountsView;
