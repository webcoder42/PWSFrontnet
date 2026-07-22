import React, { useState } from 'react';
import Breadcrumb from './Breadcrumb';
import { useUser } from '../../context/UserContext';
import { updateUserProfileAPI } from '../../utils/api';

const LANGUAGES_LIST = ['Spanish', 'Mandarin', 'Cantonese', 'Punjabi', 'Tagalog', 'Arabic', 'Italian', 'Portuguese', 'German', 'Korean', 'Vietnamese', 'Polish', 'Urdu', 'Hindi', 'Tamil', 'Persian', 'Russian', 'Japanese'];

const AddLanguageView = ({ setView }) => {
  const { user, updateUser } = useUser();
  const rp = user?.recipientProfile || {};
  const existingLanguages = rp.spokenLanguages || ['English'];
  const [selectedAddLang, setSelectedAddLang] = useState(LANGUAGES_LIST.find(l => !existingLanguages.includes(l)) || LANGUAGES_LIST[0]);

  const handleSave = async () => {
    if (existingLanguages.includes(selectedAddLang)) {
      setView('languages');
      return;
    }
    const updated = { ...rp, spokenLanguages: [...existingLanguages, selectedAddLang] };
    updateUser({ recipientProfile: updated });
    if (user?._id) {
      try { await updateUserProfileAPI(user._id, { recipientProfile: updated }); } catch {}
    }
    setView('languages');
  };

  return (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="Add Languages" sub={{ name: 'Language Preferences', view: 'languages' }} setView={setView} />
    <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">Add Languages</h2>
    <p className="text-xs text-gray-400 mb-12 leading-relaxed">Please select your preferred language for communication with caregivers. We will do our best to match you with a caregiver that speaks your preferred language</p>
    <div className="relative mb-6"><button className="w-full p-5 bg-white border-2 border-purple-600 rounded-2xl flex items-center justify-between text-purple-600 font-bold text-sm shadow-lg shadow-purple-50"><span>{selectedAddLang}</span><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg></button></div>
    <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden mb-12 divide-y divide-gray-25 h-[600px] overflow-y-auto custom-scrollbar">
      {LANGUAGES_LIST.filter(l => !existingLanguages.includes(l)).map(lang => (
        <button onClick={() => setSelectedAddLang(lang)} key={lang} className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-25 transition-colors group">
          <span className={`text-sm font-bold ${selectedAddLang === lang ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'}`}>{lang}</span>
        </button>
      ))}
    </div>
    <div className="flex gap-4">
      <button onClick={() => setView('languages')} className="flex-1 py-5 bg-white border border-gray-100 rounded-[2rem] text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all">Cancel</button>
      <button onClick={handleSave} className="flex-1 py-5 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-[2rem] font-bold text-sm shadow-xl shadow-purple-200 hover:-translate-y-1 transition-all">Add Language</button>
    </div>
  </div>
)};

export default AddLanguageView;
