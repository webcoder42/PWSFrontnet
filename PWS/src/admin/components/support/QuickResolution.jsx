import React from 'react';

const QuickResolution = () => (
  <div className="bg-gradient-to-br from-[#5915BD] to-[#7C3AED] rounded-[2.5rem] p-10 text-white shadow-[0_20px_50px_rgba(89,21,189,0.15)]">
    <h3 className="text-xl font-bold mb-6 font-serif">Quick Resolution</h3>
    <p className="text-purple-100/70 text-sm mb-8">Access predefined workflows to resolve common platform issues instantly.</p>
    <div className="space-y-4">
      <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all text-left px-6 border border-white/10">Password Reset Tool</button>
      <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all text-left px-6 border border-white/10">Shift Cancellation Override</button>
      <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all text-left px-6 border border-white/10">Client Refund Portal</button>
    </div>
  </div>
);

export default QuickResolution;
