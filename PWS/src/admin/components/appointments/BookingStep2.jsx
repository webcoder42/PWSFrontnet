import React from 'react';

const BookingStep2 = ({ psws, selectedPsw, onSelect, onBack, onContinue }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
    <div className="mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-3 font-serif tracking-tight">Assign a PSW</h2>
      <div className="flex items-center text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-xl w-fit border border-purple-100">
         Step 03 <span className="mx-2 opacity-30 text-gray-400">·</span> <span className="text-gray-400">PSW Assignment</span>
      </div>
    </div>
    
    <div className="space-y-8">
      {psws.map(psw => (
        <div 
          key={psw.id} 
          onClick={() => onSelect(psw.name)}
          className={`bg-white p-10 rounded-[2.5rem] border flex flex-col md:flex-row items-center relative overflow-hidden group transition-all duration-500 cursor-pointer ${
            selectedPsw === psw.name ? 'border-purple-600 bg-purple-50/30 shadow-lg' : 'border-gray-50 hover:border-purple-200 shadow-sm'
          }`}
        >
          {selectedPsw === psw.name && (
            <div className="absolute top-4 right-10 text-purple-600">
               <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            </div>
          )}
          
          <div className="flex-shrink-0 relative mb-8 md:mb-0">
            <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${psw.seed}`} className="w-full h-full object-cover" alt={psw.name} />
            </div>
          </div>

          <div className="md:ml-10 flex-1 w-full text-center md:text-left">
            <h4 className="text-2xl font-bold text-gray-900 font-serif mb-1">{psw.name}</h4>
            <p className="text-purple-600 text-[10px] font-bold uppercase tracking-widest mb-4">{psw.role}</p>
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
               <span className="text-orange-400 text-sm">★ {psw.rating}</span>
               <span className="text-gray-300 text-[9px] font-bold uppercase">Clinical Verified</span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {['Elite PSW', 'High Experience', 'Patient Favorite'].map(tag => (
                <span key={tag} className="bg-gray-50 text-gray-400 text-[8px] font-bold px-3 py-1.5 rounded-lg border border-gray-100">{tag}</span>
              ))}
            </div>
          </div>

          <div className="md:ml-10 w-full md:w-auto text-center md:text-right mt-8 md:mt-0">
             <button 
                onClick={(e) => { e.stopPropagation(); onSelect(psw.name); onContinue(); }} 
                className="bg-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-purple-200 hover:-translate-y-1 transition-all active:scale-[0.98]"
             >
                Assign PSW
             </button>
          </div>
        </div>
      ))}
    </div>

    <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-100">
      <button onClick={onBack} className="text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-purple-600 transition-all">Back</button>
      <button 
        disabled={!selectedPsw}
        onClick={onContinue} 
        className={`px-12 py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-widest transition-all ${
          selectedPsw ? 'bg-purple-600 text-white shadow-xl shadow-purple-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Continue to Scheduling
      </button>
    </div>
  </div>
);

export default BookingStep2;
