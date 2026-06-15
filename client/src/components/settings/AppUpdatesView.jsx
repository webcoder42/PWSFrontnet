import React from 'react';
import Breadcrumb from './Breadcrumb';

const AppUpdatesView = ({ setView }) => (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="App Updates" setView={setView} />
    <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">Automatic Updates</h2>
    <p className="text-xs text-gray-400 mb-12 leading-relaxed">Automatically install software updates overnight after they have been downloaded. You will receive a notification before updates are installed.</p>
    <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm p-10 flex items-center justify-between"><span className="text-sm font-bold text-gray-700">Enable auto updates</span><button className="w-12 h-6 rounded-full relative transition-colors bg-purple-900 shadow-inner"><div className="w-4 h-4 rounded-full bg-white absolute top-1 right-1 shadow-md"></div></button></div>
  </div>
);

export default AppUpdatesView;
