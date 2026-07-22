import React, { useState } from 'react';
import Breadcrumb from './Breadcrumb';
import { useUser } from '../../context/UserContext';

const PrefBioData = ({ setView }) => {
  const { user, updateUser } = useUser();
  const [heightValue, setHeightValue] = useState(user?.physicalStats?.height || 50);
  const [weightValue, setWeightValue] = useState(user?.physicalStats?.weight || 120);
  const [gender, setGender] = useState(user?.gender || 'Male');

  const handleSave = async () => {
    updateUser({
      gender,
      physicalStats: { height: heightValue, weight: weightValue }
    });
    if (user?._id) {
      try {
        const { updateUserProfileAPI } = await import('../../utils/api');
        await updateUserProfileAPI(user._id, { gender });
        const { updatePhysicalStatsAPI } = await import('../../utils/api');
        await updatePhysicalStatsAPI(user._id, { height: heightValue, weight: weightValue });
      } catch {}
    }
    setView('preferences');
  };

  return (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="Bio Data" sub={{ name: 'Preferences', view: 'preferences' }} setView={setView} />
    <h2 className="text-4xl font-bold text-[#1a113b] mb-2 font-serif">Bio Data</h2>
    <p className="text-gray-500 text-sm mb-8">Please update your height & weight to enhance your care experience</p>

    <div className="bg-[#f5f3ff] border border-[#ede9fe] rounded-2xl p-5 flex items-center gap-4 mb-8">
      <div className="bg-[#6d28d9] rounded-full w-5 h-5 flex items-center justify-center text-white font-bold text-[10px]">!</div>
      <p className="text-sm text-[#6d28d9] font-medium">This information helps us match you with the appropriate care provider.</p>
    </div>

    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-[1.5rem] shadow-sm p-8">
         <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Gender</h3>
         <div className="flex gap-4">
           {['Male', 'Female', 'Other'].map(g => (
             <button
               key={g}
               onClick={() => setGender(g)}
               className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${gender === g ? 'bg-[#f3e8ff] border-[#8b5cf6] text-[#7c3aed]' : 'bg-white border-gray-200 text-gray-600 hover:border-[#8b5cf6]'}`}
             >
               {g}
             </button>
           ))}
         </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-[1.5rem] shadow-sm p-8">
         <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-10">Height</h3>
         <div className="relative mb-6">
            <input 
              type="range" 
              min="0" max="100" 
              value={heightValue} 
              onChange={(e) => setHeightValue(e.target.value)} 
              style={{ background: `linear-gradient(to right, #7c3aed ${heightValue}%, #e9d5ff ${heightValue}%)` }}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-[6px] [&::-webkit-slider-thumb]:border-[#7c3aed] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-[6px] [&::-moz-range-thumb]:border-[#7c3aed] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-lg" 
            />
         </div>
         <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
            <span>4'0"</span>
            <span>4'6"</span>
            <span>5'0"</span>
            <span>5'6"</span>
            <span>6'0"</span>
         </div>
         <p className="text-center text-sm text-[#8b5cf6] mt-6 font-medium">Slide left/right to choose your height</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-[1.5rem] shadow-sm p-8">
         <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-10">Weight</h3>
         <div className="relative mb-6">
            <input 
              type="range" 
              min="0" max="100" 
              value={weightValue} 
              onChange={(e) => setWeightValue(e.target.value)} 
              style={{ background: `linear-gradient(to right, #7c3aed ${weightValue}%, #e9d5ff ${weightValue}%)` }}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-[6px] [&::-webkit-slider-thumb]:border-[#7c3aed] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-[6px] [&::-moz-range-thumb]:border-[#7c3aed] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-lg" 
            />
         </div>
         <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
            <span>80</span>
            <span>100</span>
            <span>120</span>
            <span>140</span>
            <span>160</span>
            <span>180</span>
            <span>200</span>
         </div>
         <p className="text-center text-sm text-[#8b5cf6] mt-6 font-medium">Slide left/right to choose your weight</p>
      </div>
    </div>

    <button onClick={handleSave} className="w-full mt-10 py-5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[2rem] font-bold text-base transition-colors">Save Changes</button>
  </div>
)};

export default PrefBioData;
