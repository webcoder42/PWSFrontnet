import React from 'react';
import Breadcrumb from './Breadcrumb';

const PrefHomeEnv = ({ setView }) => (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="Home Environment" sub={{ name: 'Preferences', view: 'preferences' }} setView={setView} />
    <h2 className="text-4xl font-bold text-[#1a113b] mb-2 font-serif">Home Environment</h2>
    <p className="text-gray-500 text-sm mb-10">Please provide some information about your home environment to help caregivers prepare for their visit.</p>

    <div className="bg-white border border-gray-100 rounded-[1.5rem] shadow-sm overflow-hidden p-8 space-y-8">
      <div>
         <h3 className="text-sm font-bold text-gray-900 mb-4">Home Notes</h3>
         <p className="text-sm text-gray-400">I live alone with my home with my 3 cats. I prefer that the care provider enter ...</p>
      </div>
      <div className="w-full h-px bg-gray-100"></div>
      <div>
         <h3 className="text-sm font-bold text-gray-900 mb-4">Occupancy</h3>
      </div>
      <div className="w-full h-px bg-gray-100"></div>
      <div>
         <h3 className="text-sm font-bold text-gray-900 mb-4">Building Type</h3>
         <p className="text-sm text-gray-800">Home</p>
      </div>
      <div className="w-full h-px bg-gray-100"></div>
      <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors" onClick={() => setView('pref-pets')}>
         <h3 className="text-sm font-bold text-gray-900">Pets</h3>
         <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
      </div>
    </div>

    <button onClick={() => setView('preferences')} className="w-full mt-8 py-5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[2rem] font-bold text-base transition-colors">Save Changes</button>
  </div>
);

export default PrefHomeEnv;
