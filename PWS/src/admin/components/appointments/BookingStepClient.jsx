import React from 'react';

const BookingStepClient = ({ clients, selectedClient, onSelect, onBack, onContinue }) => {
  const handleSelect = (client) => {
    onSelect(client.name, client._id || client.id);
  };
  return (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
    <div className="mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-3 font-serif tracking-tight">Select Client</h2>
      <div className="flex items-center text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-xl w-fit border border-purple-100">
         Step 01 <span className="mx-2 opacity-30 text-gray-400">·</span> <span className="text-gray-400">Client Selection</span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {clients.map(client => (
        <div 
          key={client.id} 
          onClick={() => handleSelect(client)}
          className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer relative overflow-hidden group ${
            selectedClient === client.name ? 'border-purple-600 bg-purple-50/30' : 'border-gray-50 bg-white hover:border-purple-200'
          }`}
        >
          {selectedClient === client.name && (
            <div className="absolute top-4 right-4 text-purple-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            </div>
          )}
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${client.seed}`} className="w-16 h-16 rounded-2xl mb-6 shadow-md" alt={client.name} />
          <h4 className="font-bold text-xl text-gray-900 mb-1">{client.name}</h4>
          <p className="text-xs text-gray-400 font-medium">{client.email}</p>
        </div>
      ))}
    </div>

    <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
      <button onClick={onBack} className="text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-purple-600 transition-all">Cancel</button>
      <button 
        disabled={!selectedClient}
        onClick={onContinue} 
        className={`px-12 py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-widest transition-all ${
          selectedClient ? 'bg-purple-600 text-white shadow-xl shadow-purple-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Continue to Service
      </button>
    </div>
  </div>
  );
};

export default BookingStepClient;
