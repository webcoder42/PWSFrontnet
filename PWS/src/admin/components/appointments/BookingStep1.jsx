import React from 'react';
import { services } from './AppointmentData';

const BookingStep1 = ({ selectedService, onServiceSelect, onBack, onContinue }) => {
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
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-3 font-serif tracking-tight">Select a Service Type</h2>
        <div className="flex items-center text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-xl w-fit border border-purple-100">
           Step 02 <span className="mx-2 opacity-30 text-gray-400">·</span> <span className="text-gray-400">Clinical Focus</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <button 
            key={service.id}
            onClick={() => onServiceSelect(service.name)}
            className={`flex flex-col items-start p-8 rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden group ${
              selectedService === service.name 
                ? 'border-purple-600 bg-purple-50/30 shadow-lg' 
                : 'border-gray-50 bg-white hover:border-purple-100'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 shadow-sm relative ${
              selectedService === service.name ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600'
            }`}>
              {getServiceIcon(service.id)}
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-3 leading-tight">{service.name}</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-6 font-medium">{service.description}</p>
            <div className="mt-auto flex items-center justify-between w-full pt-4 border-t border-gray-50/50">
               <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">{service.time}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-100">
        <button onClick={onBack} className="text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-purple-600 transition-all">Back</button>
        <button 
          onClick={onContinue}
          disabled={!selectedService}
          className={`px-12 py-5 rounded-[1.5rem] font-bold uppercase tracking-widest text-[11px] ${
            selectedService ? 'bg-purple-600 text-white shadow-xl shadow-purple-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue to PSW Assignment
        </button>
      </div>
    </div>
  );
};

export default BookingStep1;
