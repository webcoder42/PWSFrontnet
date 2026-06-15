import React from 'react';
import Breadcrumb from './Breadcrumb';

const PrefAllergies = ({ setView }) => (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="Allergies & Medication" sub={{ name: 'Preferences', view: 'preferences' }} setView={setView} />
    <h2 className="text-4xl font-bold text-[#1a113b] mb-2 font-serif">Allergies & Medication</h2>
    <p className="text-gray-500 text-sm mb-8">List any allergies or medical conditions that caregivers need to be aware of during care provision.</p>

    <div className="bg-[#fff8e6] border border-[#ffecb3] rounded-2xl p-5 flex items-center gap-4 mb-8">
      <div className="text-[#d97706]">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
      </div>
      <p className="text-sm text-[#92400e] font-medium">Allergen info is shared with all booked PSWs 24hrs before visits.</p>
    </div>

    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-[1.5rem] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Allergies</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span className="text-sm font-medium text-gray-800">Peanuts</span>
            </div>
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </div>
          <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span className="text-sm font-medium text-gray-800">Penicillin</span>
            </div>
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </div>
          <button className="w-full p-6 flex items-center gap-3 text-purple-600 hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            <span className="text-sm font-bold">Add Allergy</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[1.5rem] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Medication</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-sm font-medium text-gray-800">Lisinopril</span>
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </div>
          <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-sm font-medium text-gray-800">Warfarin</span>
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </div>
          <button className="w-full p-6 flex items-center gap-3 text-purple-600 hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            <span className="text-sm font-bold">Add Medication</span>
          </button>
        </div>
      </div>
    </div>

    <button onClick={() => setView('preferences')} className="w-full mt-8 py-5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[2rem] font-bold text-base transition-colors">Save Changes</button>
  </div>
);

export default PrefAllergies;
