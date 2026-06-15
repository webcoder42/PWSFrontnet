import React, { useEffect, useState } from 'react';
import Breadcrumb from './Breadcrumb';
import { useUser } from '../../../context/UserContext';
import { updateUserProfileAPI } from '../../../utils/api';

const careServicesList = [
  { id: 'bathing', name: 'Bathing & Toileting', icon: '🛁' },
  { id: 'companionship', name: 'Companionship', icon: '🤝' },
  { id: 'dressing', name: 'Dressing', icon: '👕' },
  { id: 'exercise', name: 'Exercise & Mobility', icon: '🏃' },
  { id: 'general', name: 'General Care', icon: '🩺' },
  { id: 'hygiene', name: 'Hygiene & Grooming', icon: '✂️' },
  { id: 'housekeeping', name: 'Housekeeping', icon: '🏠' },
  { id: 'meal', name: 'Meal Preparation', icon: '🍳' },
  { id: 'transportation', name: 'Transportation', icon: '🚗' },
];

const PrefCareServices = ({ setView }) => {
  const { rawUser, setUser } = useUser();
  const [selectedCareServices, setSelectedCareServices] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const recipientProfile = rawUser?.recipientProfile || {};
    const saved = recipientProfile.servicesNeeded;
    if (Array.isArray(saved)) {
      setSelectedCareServices(saved.map((item) => String(item)));
    }
  }, [rawUser]);

  const toggleCareService = (serviceId) => {
    setSelectedCareServices((prev) =>
      prev.includes(serviceId) ? prev.filter((s) => s !== serviceId) : [...prev, serviceId],
    );
  };

  const handleSave = async () => {
    if (!rawUser?._id) return alert('Please login again.');
    setIsSaving(true);
    try {
      const response = await updateUserProfileAPI(rawUser._id, {
        recipientProfile: { servicesNeeded: selectedCareServices },
      });
      if (response?.data) setUser(response.data);
      setView('preferences');
    } catch (error) {
      console.error(error);
      alert('Could not save care services.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-20">
      <Breadcrumb current="Care Services" sub={{ name: 'Preferences', view: 'preferences' }} setView={setView} />
      <h2 className="text-4xl font-bold text-[#1a113b] mb-2 font-serif">Care Services</h2>
      <p className="text-gray-500 text-sm mb-10">Please select all the specific type of care needs you require.</p>

      <div className="space-y-4">
        {careServicesList.map((service) => (
          <button
            key={service.id}
            onClick={() => toggleCareService(service.id)}
            className={`w-full p-5 rounded-[1.5rem] border flex items-center gap-4 transition-all ${selectedCareServices.includes(service.id) ? 'bg-[#f3e8ff] border-[#8b5cf6]' : 'bg-white border-gray-200 hover:border-[#8b5cf6]'}`}
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">{service.icon}</div>
            <span className="font-medium text-gray-900">{service.name}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full mt-10 py-5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[2rem] font-bold text-base transition-colors disabled:opacity-60"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default PrefCareServices;
