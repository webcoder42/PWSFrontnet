import React from 'react';

const OnboardPsw = ({ formData, setFormData, onOnboard, onCancel }) => (
  <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-2xl">
     <button onClick={onCancel} className="mb-8 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-purple-600 flex items-center gap-2">
       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
       Back to List
     </button>
     <div className="bg-white p-10 rounded-[2.5rem] border border-gray-50 shadow-sm">
       <h3 className="text-2xl font-bold mb-8 font-serif">Onboard New PSW</h3>
       <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-1 focus:ring-purple-200 outline-none font-bold text-sm"
              placeholder="e.g. Sarah Thompson"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Specialization</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-1 focus:ring-purple-200 outline-none font-bold text-sm"
            >
              <option>Alzheimer's Specialist</option>
              <option>Medication Expert</option>
              <option>Physical Therapist</option>
              <option>Elderly Care</option>
            </select>
          </div>
          <button onClick={onOnboard} className="w-full py-5 bg-purple-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 uppercase tracking-widest hover:-translate-y-1 transition-all">Complete Onboarding</button>
       </div>
     </div>
  </div>
);

export default OnboardPsw;
