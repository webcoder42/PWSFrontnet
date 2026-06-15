import React from 'react';

const HubHeader = ({ onAddCourse }) => (
  <div className="flex justify-between items-end mb-8">
    <div>
      <h2 className="text-4xl font-bold text-gray-900 mb-2">Training & Resources</h2>
      <p className="text-gray-400 text-sm">Admin training modules, compliance guides, and platform documentation.</p>
    </div>
    <button 
      onClick={onAddCourse} 
      className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 hover:-translate-y-1 transition-all"
    >
      Add New Course
    </button>
  </div>
);

export default HubHeader;
