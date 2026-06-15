import React from 'react';

const PreferencesHub = ({ setView }) => (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <div className="mb-10">
      <h2 className="text-4xl font-bold text-[#1a113b] mb-2 font-serif">Preferences</h2>
      <p className="text-gray-500 text-sm font-medium">Manage your care experience and profile details</p>
    </div>

    <div className="space-y-4">
      {[
        { title: 'Bio Data', desc: 'Personal details like name, date of birth, and gender.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>, action: () => setView('pref-bio-data') },
        { title: 'Allergies & Medication', desc: 'Important health information for care providers.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>, action: () => setView('pref-allergies') },
        { title: 'Care Type', desc: 'Specific care needs (e.g., Alzheimer\'s, post-surgery).', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>, action: () => setView('pref-care-type') },
        { title: 'Care Services', desc: 'Services needed like bathing, meal prep, or mobility.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>, action: () => setView('pref-care-services') },
        { title: 'Care Provider Preferences', desc: 'Preferences for caregiver gender or specialized skills.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>, action: () => setView('pref-care-provider') },
        { title: 'Rating & Reviews', desc: 'Feedback given to previous care providers.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>, action: null },
        { title: 'Language Preferences', desc: 'Primary and secondary languages for communication.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>, action: () => setView('languages') },
        { title: 'Home Environment', desc: 'Details about accessibility and pets at home.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>, action: () => setView('pref-home-env') },
        { title: 'Emergency Contact', desc: 'Name and contact details for emergency situations.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/>, action: () => setView('pref-emergency') },
      ].map((item, i) => (
        <div key={i} onClick={item.action} className="bg-white border border-gray-100 rounded-[1.5rem] p-5 flex items-center justify-between shadow-sm cursor-pointer hover:border-purple-200 transition-all group">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-0.5">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
        </div>
      ))}
    </div>

    <div className="mt-8 bg-[#f8f5ff] rounded-[1.5rem] p-8 text-center border border-purple-100/50">
      <div className="w-10 h-10 mx-auto bg-purple-100/50 text-[#8b5cf6] rounded-full flex items-center justify-center mb-4">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
      </div>
      <p className="text-sm text-gray-600 font-medium max-w-sm mx-auto leading-relaxed">
        Your preferences are securely stored and only shared with verified care professionals assigned to your care team.
      </p>
    </div>
  </div>
);

export default PreferencesHub;
