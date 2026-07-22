import React, { useState } from 'react';
import Breadcrumb from './Breadcrumb';
import { useUser } from '../../context/UserContext';
import { updateUserProfileAPI } from '../../utils/api';

const PrefAllergies = ({ setView }) => {
  const { user, updateUser } = useUser();
  const rp = user?.recipientProfile || {};
  const [allergies, setAllergies] = useState(rp.allergies || []);
  const [medications, setMedications] = useState(rp.medications || []);
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');

  const handleAddAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (item) => {
    setAllergies(allergies.filter(a => a !== item));
  };

  const handleAddMedication = () => {
    if (newMedication.trim() && !medications.includes(newMedication.trim())) {
      setMedications([...medications, newMedication.trim()]);
      setNewMedication('');
    }
  };

  const handleRemoveMedication = (item) => {
    setMedications(medications.filter(m => m !== item));
  };

  const handleSave = async () => {
    updateUser({ recipientProfile: { ...rp, allergies, medications } });
    if (user?._id) {
      try {
        await updateUserProfileAPI(user._id, { recipientProfile: { ...rp, allergies, medications } });
      } catch {}
    }
    setView('preferences');
  };

  return (
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
          {allergies.length === 0 && (
            <div className="p-6 text-sm text-gray-400 text-center">No allergies listed</div>
          )}
          {allergies.map((item, i) => (
            <div key={i} className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span className="text-sm font-medium text-gray-800">{item}</span>
              </div>
              <button onClick={() => handleRemoveAllergy(item)} className="text-gray-300 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          ))}
          <div className="p-6 flex items-center gap-3">
            <input
              type="text"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddAllergy()}
              placeholder="Type allergy name and press Add"
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-200"
            />
            <button onClick={handleAddAllergy} disabled={!newAllergy.trim()} className="flex items-center gap-2 text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-xl transition-colors disabled:opacity-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              <span className="text-sm font-bold">Add</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[1.5rem] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Medication</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {medications.length === 0 && (
            <div className="p-6 text-sm text-gray-400 text-center">No medications listed</div>
          )}
          {medications.map((item, i) => (
            <div key={i} className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-800">{item}</span>
              <button onClick={() => handleRemoveMedication(item)} className="text-gray-300 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          ))}
          <div className="p-6 flex items-center gap-3">
            <input
              type="text"
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMedication()}
              placeholder="Type medication name and press Add"
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-200"
            />
            <button onClick={handleAddMedication} disabled={!newMedication.trim()} className="flex items-center gap-2 text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-xl transition-colors disabled:opacity-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              <span className="text-sm font-bold">Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <button onClick={handleSave} className="w-full mt-8 py-5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[2rem] font-bold text-base transition-colors">Save Changes</button>
  </div>
)};

export default PrefAllergies;
