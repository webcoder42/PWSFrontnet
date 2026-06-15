import React, { useState } from 'react';
import Breadcrumb from './Breadcrumb';

const careServicesList = [
  { name: 'Bathing & Toileting', icon: '🛁' },
  { name: 'Companionship', icon: '🤝' },
  { name: 'Dressing', icon: '👕' },
  { name: 'Exercise & Mobility', icon: '🏃' },
  { name: 'General Care', icon: '🩺' },
  { name: 'Hygiene & Grooming', icon: '✂️' },
  { name: 'Housekeeping', icon: '🏠' },
  { name: 'Meal Preparation', icon: '🍳' },
  { name: 'Transportation', icon: '🚗' },
];

const PrefCareServices = ({ setView }) => {
  const [selectedCareServices, setSelectedCareServices] = useState([]);

  const toggleCareService = (service) => {
     setSelectedCareServices(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]);
  };

  return (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="Care Services" sub={{ name: 'Preferences', view: 'preferences' }} setView={setView} />
    <h2 className="text-4xl font-bold text-[#1a113b] mb-2 font-serif">Care Services</h2>
    <p className="text-gray-500 text-sm mb-10">Please select all the specific type of care needs you require.</p>

    <div className="space-y-4">
      {careServicesList.map(service => (
        <button 
           key={service.name} 
           onClick={() => toggleCareService(service.name)}
           className={`w-full p-5 rounded-[1.5rem] border flex items-center gap-4 transition-all ${selectedCareServices.includes(service.name) ? 'bg-[#f3e8ff] border-[#8b5cf6]' : 'bg-white border-gray-200 hover:border-[#8b5cf6]'}`}
        >
           <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">{service.icon}</div>
           <span className="font-medium text-gray-900">{service.name}</span>
        </button>
      ))}
    </div>

    <button onClick={() => setView('preferences')} className="w-full mt-10 py-5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[2rem] font-bold text-base transition-colors">Save Changes</button>
  </div>
)};

export default PrefCareServices;
