import React from 'react';
import Breadcrumb from './Breadcrumb';

const PrefEmergency = ({ setView }) => (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="Emergency Contact" sub={{ name: 'Preferences', view: 'preferences' }} setView={setView} />
    <h2 className="text-4xl font-bold text-[#1a113b] mb-2 font-serif">Emergency Contact</h2>
    <p className="text-gray-500 text-sm mb-8">In case of an emergency, we'll contact this person on your behalf. Please provide accurate information.</p>

    <div className="bg-[#fff1f2] border border-[#ffe4e6] rounded-2xl p-5 flex items-center gap-4 mb-8">
      <div className="text-[#e11d48]">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
      </div>
      <p className="text-sm text-[#be123c] font-medium">This contact will ONLY be reached in case of a medical emergency during a care session.</p>
    </div>

    <div className="space-y-6 mb-12">
      <div className="space-y-2">
         <label className="text-xs font-bold text-gray-900 ml-1">Contact's full name</label>
         <input type="text" placeholder="Enter contact's full name" className="w-full px-6 py-4 bg-white border border-[#8b5cf6] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-sm" />
      </div>
      <div className="space-y-2">
         <label className="text-xs font-bold text-gray-900 ml-1">Relationship to you</label>
         <input type="text" defaultValue="Daughter" className="w-full px-6 py-4 bg-white border border-[#8b5cf6] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-sm" />
      </div>
      <div className="space-y-2">
         <label className="text-xs font-bold text-gray-900 ml-1">Phone number</label>
         <div className="flex gap-4">
            <div className="w-32 px-4 py-4 bg-white border border-gray-200 rounded-2xl flex items-center justify-between text-sm shadow-sm cursor-pointer hover:border-gray-300">
               <span className="flex items-center gap-2"><img src="https://flagcdn.com/w20/ca.png" alt="CA" className="w-4 h-3" /> +1</span>
               <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
            </div>
            <input type="text" defaultValue="123-456-7890" className="flex-1 px-6 py-4 bg-white border border-[#8b5cf6] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-sm text-gray-500" />
         </div>
      </div>
      <div className="space-y-2">
         <label className="text-xs font-bold text-gray-900 ml-1">Email address</label>
         <input type="email" placeholder="contact@example.com" className="w-full px-6 py-4 bg-white border border-[#8b5cf6] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all shadow-sm" />
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-900 ml-1">Add a second emergency contact</h3>
      <div className="bg-white border border-gray-200 rounded-[1.5rem] p-6 shadow-sm">
         <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Emergency Contact Saved</span>
         </div>
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-400 text-white flex items-center justify-center font-bold text-lg">JS</div>
            <div>
               <h4 className="font-bold text-gray-900 text-base mb-1">Jane Smith</h4>
               <p className="text-sm text-gray-500">Daughter · 123-456-1890</p>
            </div>
         </div>
      </div>
    </div>

    <button onClick={() => setView('preferences')} className="w-full mt-10 py-5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[2rem] font-bold text-base transition-colors">Save Changes</button>
  </div>
);

export default PrefEmergency;
