import React, { useState } from 'react';
import Breadcrumb from './Breadcrumb';

const LanguagesView = ({ setView }) => {
  const [activeLangTab, setActiveLangTab] = useState('languages');

  return (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="Language Preferences" setView={setView} />
    <div className="flex bg-white rounded-[2rem] p-2 border w-fit mb-12 shadow-sm border-2 border-purple-500/10">
      <button onClick={() => setActiveLangTab('provider')} className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all ${activeLangTab === 'provider' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}>Provider Preference</button>
      <button onClick={() => setActiveLangTab('languages')} className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all ${activeLangTab === 'languages' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}>Languages</button>
    </div>

    {activeLangTab === 'languages' ? (
      <div className="animate-fade-in">
         <h2 className="text-5xl font-bold text-gray-900 mb-10 font-serif">Languages</h2>
         <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden divide-y divide-gray-25">{['English', 'French'].map(lang => (<button key={lang} className="w-full text-left p-8 flex items-center justify-between hover:bg-gray-25 transition-colors group"><span className="text-sm font-bold text-gray-700">{lang}</span><svg className="w-4 h-4 text-gray-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg></button>))}<button onClick={() => setView('add-language')} className="w-full p-8 flex items-center justify-center gap-3 text-purple-600 font-bold hover:bg-gray-25"><span className="text-xl">+</span><span className="text-sm">Add Language</span></button></div>
      </div>
    ) : (
      <div className="animate-fade-in">
         <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">Provider Preferences</h2>
         <p className="text-xs text-gray-400 mb-12">Please choose your preferred care providers gender to ensure a comfortable and respectful caregiving experience.</p>
         <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden divide-y divide-gray-25">{['Male', 'Female'].map(gender => (<div key={gender} className="p-8 flex items-center justify-between cursor-pointer hover:bg-gray-25 group"><span className="text-sm font-bold text-gray-700">{gender}</span><div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center p-0.5 ${gender === 'Male' ? 'border-purple-600' : 'border-gray-200 group-hover:border-purple-400'}`}>{gender === 'Male' && <div className="w-full h-full bg-purple-600 rounded-full"></div>}</div></div>))}</div>
         <button onClick={() => setView('main')} className="w-full py-5 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-[1.5rem] font-bold text-sm shadow-xl shadow-purple-200 hover:-translate-y-1 transition-all mt-12">Save</button>
      </div>
    )}
  </div>
)};

export default LanguagesView;
