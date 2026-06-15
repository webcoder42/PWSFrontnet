import React from 'react';
import Breadcrumb from './Breadcrumb';

const NotificationsView = ({ setView }) => (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="Notifications" setView={setView} />
    <div className="space-y-12">
      {[
        { title: 'Appointments', items: [{ label: 'Appointment Reminders', desc: 'Get notified of upcoming shifts and care visits.', checked: true }, { label: 'Visit Confirmations', desc: 'Receive alerts when a caregiver confirms a visit.', checked: true }, { label: 'Cancellation Alerts', desc: 'Immediate notifications for schedule changes or cancellations.', checked: true }]},
        { title: 'Messages', items: [{ label: 'New Messages', desc: 'Get notified when you receive a message from a client or PSW.', checked: true }, { label: 'Message Read Receipts', desc: 'Show others when you\'ve read their messages.', checked: false }]},
        { title: 'Account & Security', items: [{ label: 'Profile Updates', desc: 'Confirmations when changes are made to your account details.', checked: true }, { label: 'Payment Notifications', desc: 'Receipts and billing updates for completed care sessions.', checked: true }, { label: 'Security Alerts', desc: 'Alerts for unrecognized logins or password changes.', checked: true, required: true }]},
        { title: 'Marketing', items: [{ label: 'Tips & Platform Updates', desc: 'Helpful advice on home care and news about the curator platform.', checked: false }, { label: 'Special Offers', desc: 'Exclusive discounts and promotional events for our users.', checked: false }]}
      ].map(group => (
        <div key={group.title}>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 ml-1">{group.title}</h3>
          <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden px-8 py-4 divide-y divide-gray-25">{group.items.map((item, i) => (<div key={i} className="py-8 flex items-center justify-between"><div><h4 className="text-sm font-bold text-purple-600 mb-1">{item.label}</h4><p className="text-xs text-gray-400">{item.desc}</p>{item.required && <p className="text-[8px] font-bold text-rose-500 uppercase mt-2">Required. Cannot be disabled.</p>}</div><button className={`w-12 h-6 rounded-full relative transition-colors ${item.checked ? 'bg-purple-600' : 'bg-gray-200'} ${item.required ? 'opacity-40 cursor-not-allowed' : ''}`}><div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm ${item.checked ? 'right-1' : 'left-1'}`}></div></button></div>))}</div>
        </div>
      ))}
    </div>
    <div className="flex justify-end mt-12"><button onClick={() => setView('main')} className="px-12 py-5 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-[1.5rem] font-bold text-sm shadow-xl shadow-purple-200 hover:-translate-y-1 transition-all">Save Preferences</button></div>
  </div>
);

export default NotificationsView;
