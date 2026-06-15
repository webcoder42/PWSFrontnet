import React from 'react';

const ContentHub = () => (
  <div className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
    <h3 className="text-xl font-bold mb-8 font-serif leading-none">Content Hub</h3>
    <div className="space-y-6">
      <div className="p-6 bg-gray-25/50 rounded-3xl border border-dashed border-gray-200 group hover:border-purple-300 transition-all cursor-pointer">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Learning Hub</p>
        <h4 className="font-bold text-gray-900 mb-1">Manage Courses</h4>
        <p className="text-xs text-gray-500">Update training materials and certification tests.</p>
      </div>
      <div className="p-6 bg-gray-25/50 rounded-3xl border border-dashed border-gray-200 group hover:border-purple-300 transition-all cursor-pointer">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Marketing</p>
        <h4 className="font-bold text-gray-900 mb-1">Promo Banners</h4>
        <p className="text-xs text-gray-500">Edit homepage banners and promotional content.</p>
      </div>
    </div>
  </div>
);

export default ContentHub;
