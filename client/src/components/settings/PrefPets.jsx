import React from 'react';
import Breadcrumb from './Breadcrumb';

const PrefPets = ({ setView }) => (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="Pets" sub={{ name: 'Preferences', view: 'preferences' }} setView={setView} />
    <h2 className="text-4xl font-bold text-[#1a113b] mb-2 font-serif">Pets</h2>
    <p className="text-gray-500 text-sm mb-10">Please let us know if you have any pets in your home.</p>

    <div className="bg-white border border-gray-100 rounded-[1.5rem] shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-100">
        <div className="p-6 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-800">Dog</span>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-900">1</span>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
        <button className="w-full p-6 flex items-center gap-3 text-purple-600 hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          <span className="text-sm font-bold">Add Pets</span>
        </button>
      </div>
    </div>

    <button onClick={() => setView('pref-home-env')} className="w-full mt-8 py-5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[2rem] font-bold text-base transition-colors">Save</button>
  </div>
);

export default PrefPets;
