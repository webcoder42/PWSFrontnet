import React, { useState } from 'react';
import Breadcrumb from './Breadcrumb';
import { useUser } from '../../context/UserContext';
import { updateUserProfileAPI } from '../../utils/api';

const PrefPets = ({ setView }) => {
  const { user, updateUser } = useUser();
  const rp = user?.recipientProfile || {};
  const [pets, setPets] = useState(rp.pets || []);
  const [newPetName, setNewPetName] = useState('');
  const [newPetCount, setNewPetCount] = useState(1);

  const handleAddPet = () => {
    if (newPetName.trim()) {
      setPets([...pets, { name: newPetName.trim(), count: newPetCount }]);
      setNewPetName('');
      setNewPetCount(1);
    }
  };

  const handleRemovePet = (index) => {
    setPets(pets.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const updated = { ...rp, pets };
    updateUser({ recipientProfile: updated });
    if (user?._id) {
      try { await updateUserProfileAPI(user._id, { recipientProfile: updated }); } catch {}
    }
    setView('pref-home-env');
  };

  return (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="Pets" sub={{ name: 'Preferences', view: 'preferences' }} setView={setView} />
    <h2 className="text-4xl font-bold text-[#1a113b] mb-2 font-serif">Pets</h2>
    <p className="text-gray-500 text-sm mb-10">Please let us know if you have any pets in your home.</p>

    <div className="bg-white border border-gray-100 rounded-[1.5rem] shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-100">
        {pets.length === 0 && (
          <div className="p-6 text-sm text-gray-400 text-center">No pets listed</div>
        )}
        {pets.map((pet, i) => (
          <div key={i} className="p-6 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-800">{pet.name}</span>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-900">{pet.count}</span>
              <button onClick={() => handleRemovePet(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
        ))}
        <div className="p-6 flex items-center gap-3">
          <input
            type="text"
            value={newPetName}
            onChange={(e) => setNewPetName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPet()}
            placeholder="Pet type (e.g., Dog, Cat)"
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-200"
          />
          <input
            type="number"
            min="1"
            value={newPetCount}
            onChange={(e) => setNewPetCount(Number(e.target.value))}
            className="w-16 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-200 text-center"
          />
          <button onClick={handleAddPet} disabled={!newPetName.trim()} className="flex items-center gap-2 text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-xl transition-colors disabled:opacity-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            <span className="text-sm font-bold">Add</span>
          </button>
        </div>
      </div>
    </div>

    <button onClick={handleSave} className="w-full mt-8 py-5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[2rem] font-bold text-base transition-colors">Save</button>
  </div>
)};

export default PrefPets;
