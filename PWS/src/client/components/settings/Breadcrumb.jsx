import React from 'react';

const Breadcrumb = ({ current, sub, setView }) => (
  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-8 lowercase tracking-tight">
    <button onClick={() => setView('main')} className="hover:text-purple-600 transition-colors capitalize">Settings</button>
    <span className="mt-0.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg></span>
    {sub ? (
      <>
        <button onClick={() => setView(sub.view)} className="hover:text-purple-600 transition-colors capitalize">{sub.name}</button>
        <span className="mt-0.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg></span>
      </>
    ) : null}
    <span className="text-purple-600">{current}</span>
  </div>
);

export default Breadcrumb;
