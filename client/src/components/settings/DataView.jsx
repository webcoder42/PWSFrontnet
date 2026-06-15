import React from 'react';
import Breadcrumb from './Breadcrumb';

const DataView = ({ setView }) => (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="Data" setView={setView} />
    <h2 className="text-4xl font-bold text-gray-900 mb-12 font-serif">Data</h2>
    <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-12 mb-12">
       <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-bold text-gray-900">Medical Data Download</h4>
          <div className="w-6 h-6 rounded-full border-4 border-purple-600 flex items-center justify-center p-0.5 shadow-lg shadow-purple-50"><div className="w-full h-full bg-purple-600 rounded-full"></div></div>
       </div>
       <p className="text-sm text-gray-400">We'll send your medical data on file to jackhudson@gmail.com</p>
    </div>
    <button onClick={() => setView('main')} className="w-full max-w-lg mx-auto block py-5 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-[2rem] font-bold text-sm shadow-2xl shadow-purple-200 hover:-translate-y-1 transition-all">Send</button>
    <p className="text-center text-[10px] text-gray-400 mt-12 font-medium">Your data is encrypted and handled in compliance with HIPAA and GDPR.</p>
  </div>
);

export default DataView;
