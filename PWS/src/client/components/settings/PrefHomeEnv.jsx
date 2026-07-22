import React, { useState } from 'react';
import Breadcrumb from './Breadcrumb';
import { useUser } from '../../context/UserContext';
import { updateUserProfileAPI } from '../../utils/api';

const PrefHomeEnv = ({ setView }) => {
  const { user, updateUser } = useUser();
  const rp = user?.recipientProfile || {};
  const he = rp.homeEnvironment || {};
  const [homeNotes, setHomeNotes] = useState(he.homeNotes || '');
  const [occupancy, setOccupancy] = useState(he.occupancy || '');
  const [buildingType, setBuildingType] = useState(he.buildingType || '');

  const handleSave = async () => {
    const updated = { ...rp, homeEnvironment: { homeNotes, occupancy, buildingType } };
    updateUser({ recipientProfile: updated });
    if (user?._id) {
      try { await updateUserProfileAPI(user._id, { recipientProfile: updated }); } catch {}
    }
    setView('preferences');
  };

  return (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="Home Environment" sub={{ name: 'Preferences', view: 'preferences' }} setView={setView} />
    <h2 className="text-4xl font-bold text-[#1a113b] mb-2 font-serif">Home Environment</h2>
    <p className="text-gray-500 text-sm mb-10">Please provide some information about your home environment to help caregivers prepare for their visit.</p>

    <div className="bg-white border border-gray-100 rounded-[1.5rem] shadow-sm overflow-hidden p-8 space-y-8">
      <div>
         <h3 className="text-sm font-bold text-gray-900 mb-4">Home Notes</h3>
         <textarea
           value={homeNotes}
           onChange={(e) => setHomeNotes(e.target.value)}
           placeholder="Describe your home environment, any special instructions for caregivers..."
           className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all resize-none"
           rows={3}
         />
      </div>
      <div className="w-full h-px bg-gray-100"></div>
      <div>
         <h3 className="text-sm font-bold text-gray-900 mb-4">Occupancy</h3>
         <input
           type="text"
           value={occupancy}
           onChange={(e) => setOccupancy(e.target.value)}
           placeholder="e.g., Live alone, with family, with roommate"
           className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all"
         />
      </div>
      <div className="w-full h-px bg-gray-100"></div>
      <div>
         <h3 className="text-sm font-bold text-gray-900 mb-4">Building Type</h3>
         <select
           value={buildingType}
           onChange={(e) => setBuildingType(e.target.value)}
           className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all appearance-none cursor-pointer"
         >
           <option value="">Select building type</option>
           <option value="Home">Home</option>
           <option value="Apartment">Apartment</option>
           <option value="Retirement Home">Retirement Home</option>
           <option value="Assisted Living">Assisted Living</option>
           <option value="Other">Other</option>
         </select>
      </div>
      <div className="w-full h-px bg-gray-100"></div>
      <div className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors" onClick={() => setView('pref-pets')}>
         <h3 className="text-sm font-bold text-gray-900">Pets</h3>
         <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
      </div>
    </div>

    <button onClick={handleSave} className="w-full mt-8 py-5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[2rem] font-bold text-base transition-colors">Save Changes</button>
  </div>
)};

export default PrefHomeEnv;
