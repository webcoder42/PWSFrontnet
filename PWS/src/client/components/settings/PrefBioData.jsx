import React, { useEffect, useState } from 'react';
import Breadcrumb from './Breadcrumb';
import { useUser } from '../../../context/UserContext';
import { updateUserPhysicalStatsAPI } from '../../../utils/api';

const PrefBioData = ({ setView }) => {
  const { rawUser, setUser } = useUser();
  const [heightValue, setHeightValue] = useState(165);
  const [weightValue, setWeightValue] = useState(70);
  const [heightUnit, setHeightUnit] = useState('cm');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!rawUser?.physicalStats) return;

    const storedHeight = rawUser.physicalStats.height;
    const storedWeight = rawUser.physicalStats.weight;

    if (storedHeight?.value !== undefined) setHeightValue(Number(storedHeight.value));
    if (storedHeight?.unit) setHeightUnit(storedHeight.unit);
    if (storedWeight?.value !== undefined) setWeightValue(Number(storedWeight.value));
    if (storedWeight?.unit) setWeightUnit(storedWeight.unit);
  }, [rawUser]);

  const heightMin = heightUnit === 'ft' ? 48 : 120;
  const heightMax = heightUnit === 'ft' ? 84 : 215;
  const weightMin = weightUnit === 'lbs' ? 80 : 35;
  const weightMax = weightUnit === 'lbs' ? 250 : 115;

  const saveChanges = async () => {
    if (!rawUser?._id) return;

    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await updateUserPhysicalStatsAPI(rawUser._id, {
        height: { value: heightValue, unit: heightUnit },
        weight: { value: weightValue, unit: weightUnit },
      });

      const updatedUser = {
        ...rawUser,
        ...(response?.data ?? response ?? {}),
      };
      setUser(updatedUser);
      setMessage('Bio data saved successfully.');
    } catch (err) {
      setError(err?.message || 'Unable to save bio data.');
    } finally {
      setIsSaving(false);
    }
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
         <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-10">Height</h3>
         <div className="relative mb-6">
            <input 
              type="range" 
              min={heightMin} max={heightMax} 
              value={heightValue} 
              onChange={(e) => setHeightValue(Number(e.target.value))} 
              style={{ background: `linear-gradient(to right, #7c3aed ${(heightValue - heightMin) / (heightMax - heightMin) * 100}%, #e9d5ff ${(heightValue - heightMin) / (heightMax - heightMin) * 100}%)` }}
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
              min={weightMin} max={weightMax} 
              value={weightValue} 
              onChange={(e) => setWeightValue(Number(e.target.value))} 
              style={{ background: `linear-gradient(to right, #7c3aed ${(weightValue - weightMin) / (weightMax - weightMin) * 100}%, #e9d5ff ${(weightValue - weightMin) / (weightMax - weightMin) * 100}%)` }}
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

    <button
      onClick={saveChanges}
      disabled={isSaving}
      className={`w-full mt-10 py-5 rounded-[2rem] font-bold text-base transition-colors ${isSaving ? 'bg-[#c4b5fd] text-white cursor-not-allowed' : 'bg-[#8b5cf6] hover:bg-[#7c3aed] text-white'}`}
    >
      {isSaving ? 'Saving...' : 'Save Changes'}
    </button>

    {message ? <p className="mt-4 text-sm text-emerald-600">{message}</p> : null}
    {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
  </div>
  );
};

export default PrefBioData;
