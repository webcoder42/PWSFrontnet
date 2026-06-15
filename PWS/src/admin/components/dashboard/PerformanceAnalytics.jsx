import React from 'react';

const PerformanceAnalytics = ({ data }) => (
  <div className="mb-12 bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 relative overflow-hidden">
    <div className="flex justify-between items-center mb-10">
      <div>
        <h3 className="text-2xl font-bold font-serif">Performance Analytics</h3>
        <p className="text-gray-400 text-xs mt-1">Platform growth and session trends over the last 6 months.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sessions</span>
        </div>
      </div>
    </div>
    
    <div className="h-64 flex items-end justify-between px-4 gap-4">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-4 group">
          <div className="w-full relative flex flex-col items-center">
            <div 
              className="w-full max-w-[40px] bg-gradient-to-t from-purple-500 to-purple-600 rounded-t-xl transition-all duration-1000 ease-out group-hover:scale-x-110 group-hover:brightness-110 shadow-lg shadow-purple-100/50"
              style={{ height: `${item.value * 1.5}px` }}
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {item.value}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default PerformanceAnalytics;
