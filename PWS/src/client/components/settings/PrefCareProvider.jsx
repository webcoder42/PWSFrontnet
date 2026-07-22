import React, { useState } from 'react';
import Breadcrumb from './Breadcrumb';
import { useUser } from '../../context/UserContext';
import { updateUserProfileAPI } from '../../utils/api';

const PrefCareProvider = ({ setView }) => {
  const { user, updateUser } = useUser();
  const rp = user?.recipientProfile || {};
  const [prefCareProvider, setPrefCareProvider] = useState(rp.preferredProviderGender || 'No Preference');

  const handleSave = async () => {
    const updated = { ...rp, preferredProviderGender: prefCareProvider };
    updateUser({ recipientProfile: updated });
    if (user?._id) {
      try { await updateUserProfileAPI(user._id, { recipientProfile: updated }); } catch {}
    }
    setView('preferences');
  };

  return (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="Care Provider Preferences" sub={{ name: 'Preferences', view: 'preferences' }} setView={setView} />
    <h2 className="text-4xl font-bold text-[#1a113b] mb-2 font-serif">Care Provider Preferences</h2>
    <p className="text-gray-500 text-sm mb-10">Please choose your preferred care providers gender to ensure a comfortable and respectful caregiving experience.</p>

    <div className="bg-white border border-gray-100 rounded-[1.5rem] shadow-sm overflow-hidden divide-y divide-gray-100">
      {['Female', 'Male', 'No Preference'].map((option) => (
        <div key={option} onClick={() => setPrefCareProvider(option)} className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
          <span className="text-sm font-bold text-gray-900">{option}</span>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center p-0.5 transition-colors ${prefCareProvider === option ? 'border-purple-600' : 'border-gray-300'}`}>
            {prefCareProvider === option && <div className="w-full h-full bg-purple-600 rounded-full"></div>}
          </div>
        </div>
      ))}
    </div>

    <button onClick={handleSave} className="w-full mt-8 py-5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[2rem] font-bold text-base transition-colors">Save</button>
  </div>
)};

export default PrefCareProvider;
