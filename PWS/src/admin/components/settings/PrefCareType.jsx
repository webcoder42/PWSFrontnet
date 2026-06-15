import React, { useState } from 'react';
import Breadcrumb from './Breadcrumb';

const careTypes = ['Alzheimer\'s Care', 'Cancer Care', 'Dementia Care', 'Diabetes Care', 'Elder Care', 'Palliative Care', 'Parkinson\'s Care', 'Post-Surgery Care', 'Senior Care', 'Stroke Care'];

const PrefCareType = ({ setView }) => {
  const [selectedCareTypes, setSelectedCareTypes] = useState(['Alzheimer\'s Care', 'Elder Care']);

  const toggleCareType = (type) => {
    setSelectedCareTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  return (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="Care Type" sub={{ name: 'Preferences', view: 'preferences' }} setView={setView} />
    <h2 className="text-4xl font-bold text-[#1a113b] mb-2 font-serif">Care Type</h2>
    <p className="text-gray-500 text-sm mb-10">Please select all the specific type of care needs you require.</p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {careTypes.map(type => (
        <button 
           key={type} 
           onClick={() => toggleCareType(type)}
           className={`py-4 px-6 rounded-[2rem] border text-sm font-medium transition-all ${selectedCareTypes.includes(type) ? 'bg-[#f3e8ff] border-[#8b5cf6] text-[#7c3aed]' : 'bg-white border-gray-200 text-gray-600 hover:border-[#8b5cf6] hover:text-[#7c3aed]'}`}
        >
           {type}
        </button>
      ))}
    </div>

    <button onClick={() => setView('preferences')} className="w-full mt-12 py-5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[2rem] font-bold text-base transition-colors">Save Changes</button>
  </div>
)};

export default PrefCareType;
