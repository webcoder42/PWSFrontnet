import React from 'react';
import Breadcrumb from './Breadcrumb';

const AboutView = ({ setView }) => (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="About" setView={setView} />
    <h2 className="text-5xl font-bold text-gray-900 mb-12 font-serif">About</h2>
    <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden divide-y divide-gray-50">{['Privacy Policy', 'Terms of Use'].map(item => (<button key={item} className="w-full text-left p-8 flex items-center justify-between hover:bg-gray-25 transition-all group"><span className="text-sm font-bold text-gray-700">{item}</span><svg className="w-4 h-4 text-gray-200 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg></button>))}</div>
  </div>
);

export default AboutView;
