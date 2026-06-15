import React from 'react';
import { services } from './AppointmentData';

const BookingStep1 = ({ selectedService, onServiceSelect, onBack, onContinue }) => {
  // Map icons to services
  const getServiceIcon = (id) => {
    const icons = {
      1: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
      2: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.641.32a2 2 0 01-1.836 0l-.64-.32a6 6 0 00-3.86-.517l-2.388.477a2 2 0 00-1.022.547l-1.04 1.04a2 2 0 000 2.828l1.04 1.04a2 2 0 001.022.547l2.387.477a6 6 0 003.86-.517l.641-.32a2 2 0 011.836 0l.64.32a6 6 0 003.86.517l2.388-.477a2 2 0 001.022-.547l1.04-1.04a2 2 0 000-2.828l-1.04-1.04z" /></svg>,
      default: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    };
    return icons[id] || icons.default;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Editorial Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-3 font-serif tracking-tight">Select a Service Type</h2>
        <div className="flex items-center text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-xl w-fit border border-purple-100">
           Step 01 <span className="mx-2 opacity-30 text-gray-400">·</span> <span className="text-gray-400">Clinical Focus</span>
        </div>
      </div>

      {/* Service Grid - High Fidelity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <button 
            key={service.id}
            onClick={() => onServiceSelect(service)}
            className={`flex flex-col items-start p-8 rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden group ${
              selectedService?.id === service.id 
                ? 'border-[#5915BD] bg-[#F9F7FF] shadow-[0_20px_50px_rgba(89,21,189,0.08)]' 
                : 'border-gray-50 bg-white hover:border-purple-100 hover:shadow-xl hover:shadow-gray-100/50'
            }`}
          >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[100%] transition-opacity duration-500 ${
              selectedService?.id === service.id ? 'bg-purple-100/40' : 'bg-gray-50/50 opacity-0 group-hover:opacity-100'
            }`}></div>

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 shadow-sm relative ${
              selectedService?.id === service.id ? 'bg-[#5915BD] text-white shadow-purple-200' : 'bg-purple-50 text-purple-600'
            }`}>
              {getServiceIcon(service.id)}
            </div>

            <h3 className="font-bold text-gray-900 text-lg mb-3 leading-tight">{service.name}</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-6 font-medium">{service.description}</p>
            
            <div className="mt-auto flex items-center justify-between w-full pt-4 border-t border-gray-50/50">
               <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">{service.time}</span>
               {selectedService?.id === service.id && (
                 <div className="bg-[#5915BD] w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg animate-scale-in">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                 </div>
               )}
            </div>
          </button>
        ))}
      </div>

      {/* Clinical Notes Section */}
      <div className="mt-16 bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-[0_20px_60px_rgba(0,0,0,0.02)] relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50/50 rounded-bl-[100%] opacity-50"></div>
         <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></div>
            <div>
               <h4 className="text-sm font-bold text-gray-900 leading-none">Clinical Notes & Requirements</h4>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 opacity-70">Optional · Patient-Specific Care Details</p>
            </div>
         </div>
         <textarea 
          className="w-full p-6 bg-gray-50 border border-transparent rounded-[1.5rem] text-sm focus:bg-white focus:border-purple-100 focus:ring-4 focus:ring-purple-50 transition-all min-h-[160px] outline-none placeholder:text-gray-300 font-medium leading-relaxed"
          placeholder="E.g. Experience with dementia care required, specific mobility lift equipment needs, or preferred medical background..."
         ></textarea>
      </div>

      {/* Navigation Suite */}
      <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-100">
        <button onClick={onBack} className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-purple-600 transition-all group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
          Return to Hub
        </button>
        <button 
          onClick={onContinue}
          disabled={!selectedService}
          className={`px-12 py-5 rounded-[1.5rem] font-bold flex items-center transition-all uppercase tracking-widest text-[11px] ${
            selectedService 
              ? 'bg-gradient-to-r from-[#5915BD] to-[#7C3AED] text-white shadow-xl shadow-purple-100 hover:shadow-purple-200 hover:-translate-y-1' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Confirm & Select Caregiver <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
};

export default BookingStep1;
