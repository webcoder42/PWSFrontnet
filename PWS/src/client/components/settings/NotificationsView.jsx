import React, { useState } from 'react';
import Breadcrumb from './Breadcrumb';
import { useUser } from '../../context/UserContext';
import { updateUserProfileAPI } from '../../utils/api';

const NOTIF_GROUPS = [
  {
    title: 'Appointments',
    key: 'appointments',
    items: [
      { key: 'appointmentReminders', label: 'Appointment Reminders', desc: 'Get notified of upcoming shifts and care visits.' },
      { key: 'visitConfirmations', label: 'Visit Confirmations', desc: 'Receive alerts when a caregiver confirms a visit.' },
      { key: 'cancellationAlerts', label: 'Cancellation Alerts', desc: 'Immediate notifications for schedule changes or cancellations.' },
    ]
  },
  {
    title: 'Messages',
    key: 'messages',
    items: [
      { key: 'newMessages', label: 'New Messages', desc: 'Get notified when you receive a message from a client or PSW.' },
      { key: 'readReceipts', label: 'Message Read Receipts', desc: 'Show others when you\'ve read their messages.' },
    ]
  },
  {
    title: 'Account & Security',
    key: 'security',
    items: [
      { key: 'profileUpdates', label: 'Profile Updates', desc: 'Confirmations when changes are made to your account details.' },
      { key: 'paymentNotifications', label: 'Payment Notifications', desc: 'Receipts and billing updates for completed care sessions.' },
      { key: 'securityAlerts', label: 'Security Alerts', desc: 'Alerts for unrecognized logins or password changes.', required: true },
    ]
  },
  {
    title: 'Marketing',
    key: 'marketing',
    items: [
      { key: 'tipsUpdates', label: 'Tips & Platform Updates', desc: 'Helpful advice on home care and news about the curator platform.' },
      { key: 'specialOffers', label: 'Special Offers', desc: 'Exclusive discounts and promotional events for our users.' },
    ]
  }
];

const NotificationsView = ({ setView }) => {
  const { user, updateUser } = useUser();
  const np = user?.notificationPreferences || {};
  const [prefs, setPrefs] = useState({
    appointmentReminders: np.appointmentReminders !== undefined ? np.appointmentReminders : true,
    visitConfirmations: np.visitConfirmations !== undefined ? np.visitConfirmations : true,
    cancellationAlerts: np.cancellationAlerts !== undefined ? np.cancellationAlerts : true,
    newMessages: np.newMessages !== undefined ? np.newMessages : true,
    readReceipts: np.readReceipts !== undefined ? np.readReceipts : false,
    profileUpdates: np.profileUpdates !== undefined ? np.profileUpdates : true,
    paymentNotifications: np.paymentNotifications !== undefined ? np.paymentNotifications : true,
    securityAlerts: np.securityAlerts !== undefined ? np.securityAlerts : true,
    tipsUpdates: np.tipsUpdates !== undefined ? np.tipsUpdates : false,
    specialOffers: np.specialOffers !== undefined ? np.specialOffers : false,
  });

  const toggle = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    updateUser({ notificationPreferences: prefs });
    if (user?._id) {
      try { await updateUserProfileAPI(user._id, { notificationPreferences: prefs }); } catch {}
    }
    setView('main');
  };

  return (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20">
    <Breadcrumb current="Notifications" setView={setView} />
    <div className="space-y-12">
      {NOTIF_GROUPS.map(group => (
        <div key={group.title}>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 ml-1">{group.title}</h3>
          <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden px-8 py-4 divide-y divide-gray-25">
            {group.items.map((item) => (
              <div key={item.key} className="py-8 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-purple-600 mb-1">{item.label}</h4>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                  {item.required && <p className="text-[8px] font-bold text-rose-500 uppercase mt-2">Required. Cannot be disabled.</p>}
                </div>
                <button
                  onClick={() => !item.required && toggle(item.key)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${prefs[item.key] ? 'bg-purple-600' : 'bg-gray-200'} ${item.required ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm ${prefs[item.key] ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="flex justify-end mt-12">
      <button onClick={handleSave} className="px-12 py-5 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-[1.5rem] font-bold text-sm shadow-xl shadow-purple-200 hover:-translate-y-1 transition-all">Save Preferences</button>
    </div>
  </div>
)};

export default NotificationsView;
