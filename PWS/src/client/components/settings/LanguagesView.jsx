import React, { useState } from 'react';
import Breadcrumb from './Breadcrumb';
import { useUser } from '../../context/UserContext';
import { updateUserProfileAPI } from '../../utils/api';

const LanguagesView = ({ setView }) => {
  const { user, updateUser } = useUser();
  const rp = user?.recipientProfile || {};
  const [activeLangTab, setActiveLangTab] = useState('languages');
  const [languages, setLanguages] = useState(rp.spokenLanguages || ['English']);
  const [prefGender, setPrefGender] = useState(rp.preferredProviderGender || 'No Preference');

  const handleRemoveLanguage = (lang) => {
    setLanguages(languages.filter(l => l !== lang));
  };

  const handleAddLanguage = () => {
    setView('add-language');
  };

  const handleSave = async () => {
    const updated = { ...rp, spokenLanguages: languages, preferredProviderGender: prefGender };
    updateUser({ recipientProfile: updated });
    if (user?._id) {
      try { await updateUserProfileAPI(user._id, { recipientProfile: updated }); } catch {}
    }
    setView('main');
  };

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
         <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden divide-y divide-gray-25">
           {languages.map(lang => (
             <div key={lang} className="w-full flex items-center justify-between p-8 hover:bg-gray-25 transition-colors group">
               <span className="text-sm font-bold text-gray-700">{lang}</span>
               <button onClick={() => handleRemoveLanguage(lang)} className="text-gray-300 hover:text-red-500 transition-colors">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
               </button>
             </div>
           ))}
           <button onClick={handleAddLanguage} className="w-full p-8 flex items-center justify-center gap-3 text-purple-600 font-bold hover:bg-gray-25">
             <span className="text-xl">+</span><span className="text-sm">Add Language</span>
           </button>
         </div>
      </div>
    ) : (
      <div className="animate-fade-in">
         <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">Provider Preferences</h2>
         <p className="text-xs text-gray-400 mb-12">Please choose your preferred care providers gender to ensure a comfortable and respectful caregiving experience.</p>
         <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden divide-y divide-gray-25">
           {['Male', 'Female', 'No Preference'].map(gender => (
             <div key={gender} onClick={() => setPrefGender(gender)} className="p-8 flex items-center justify-between cursor-pointer hover:bg-gray-25 group">
               <span className="text-sm font-bold text-gray-700">{gender}</span>
               <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center p-0.5 ${prefGender === gender ? 'border-purple-600' : 'border-gray-200 group-hover:border-purple-400'}`}>
                 {prefGender === gender && <div className="w-full h-full bg-purple-600 rounded-full"></div>}
               </div>
             </div>
           ))}
         </div>
      </div>
    )}
    <button onClick={handleSave} className="w-full py-5 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-[1.5rem] font-bold text-sm shadow-xl shadow-purple-200 hover:-translate-y-1 transition-all mt-12">Save</button>
  </div>
)};

export default LanguagesView;
