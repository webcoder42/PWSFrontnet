import React from 'react';

const OperationsSummary = () => (
  <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm relative overflow-hidden">
     <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10">Operations Summary — March</h3>
     <div className="flex items-end justify-between h-32 mb-8 px-4">
        {[
          { w: 'W1', h: '40%' },
          { w: 'W2', h: '80%', active: true },
          { w: 'W3', h: '30%' },
          { w: 'W4', h: '50%' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
             <div className={`w-3 ${item.active ? 'bg-purple-600' : 'bg-purple-100'} rounded-full transition-all duration-1000`} style={{ height: item.h }}></div>
             <span className={`text-[8px] font-bold mt-3 ${item.active ? 'text-purple-600' : 'text-gray-300'}`}>{item.w}</span>
          </div>
        ))}
     </div>
     <div className="space-y-4 pt-4 border-t border-gray-50">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 font-medium tracking-tight">Total hours billed</span>
          <span className="text-sm font-bold text-gray-900">1,248 hrs</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 font-medium tracking-tight">Avg session duration</span>
          <span className="text-sm font-bold text-gray-900">1h 15m</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 font-medium tracking-tight">Top PSW</span>
          <span className="text-sm font-bold text-purple-600">S. Johnson</span>
        </div>
     </div>
  </div>
);

export default OperationsSummary;
