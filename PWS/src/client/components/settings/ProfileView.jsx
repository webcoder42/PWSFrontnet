import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { updateUserProfileAPI } from '../../utils/api';
import Breadcrumb from './Breadcrumb';

const ProfileView = ({ setView }) => {
  const { user, updateUser } = useUser();
  const addr = user?.address || {};

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(addr.street || '');
  const [city, setCity] = useState(addr.city || '');
  const [province, setProvince] = useState(addr.province || '');
  const [postalCode, setPostalCode] = useState(addr.postalCode || '');
  const [saving, setSaving] = useState(false);

  const userFullName = `${user?.firstName || 'User'} ${user?.lastName || ''}`;

  const handleSave = async () => {
    setSaving(true);
    const updates = {
      firstName,
      lastName,
      phone,
      address: { street, city, province, postalCode },
    };
    updateUser(updates);
    if (user?._id) {
      try {
        await updateUserProfileAPI(user._id, updates);
      } catch {}
    }
    setSaving(false);
    setView('main');
  };

  return (
  <div className="animate-fade-in pb-20">
    <Breadcrumb current="Profile Setting" setView={setView} />
    <div className="mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-2 font-serif">Profile Setting</h2>
      <p className="text-gray-400 text-sm max-w-xl leading-relaxed">Manage your account preferences, update your clinical identity, and ensure your contact information is up to date.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      <div className="lg:col-span-4 space-y-6">
         <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-10 flex flex-col items-center text-center">
            <div className="relative mb-6">
               <img src={user?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName || 'User'}`} className="w-32 h-32 rounded-[2rem] border-4 border-purple-50 shadow-lg object-cover" alt="Profile" />
               <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#5915BD] text-white rounded-xl shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
               </button>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{userFullName}</h3>
            <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-10">Care Recipient</p>
            
            <div className="w-full space-y-6 text-left">
               <div className="flex items-start gap-4">
                  <div className="text-purple-600 mt-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></div>
                  <div><p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Email</p><p className="text-sm font-bold text-gray-800">{user?.email || 'N/A'}</p></div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="text-purple-600 mt-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
                  <div><p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Address</p><p className="text-sm font-bold text-gray-800 max-w-[150px]">{street ? `${street}, ${city}` : 'No address set'}</p></div>
               </div>
            </div>
         </div>

         <div className="bg-[#F6F0FF] rounded-[1.5rem] p-6 flex items-center gap-5 border border-purple-100/50">
            <div className="bg-[#5915BD] w-6 h-6 rounded-md flex items-center justify-center text-white shadow-lg"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg></div>
            <p className="text-[10px] font-bold text-[#5915BD] leading-relaxed">Your profile is verified and secured with two-factor authentication.</p>
         </div>
      </div>

      <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-12">
         <h3 className="text-3xl font-bold text-gray-900 mb-2 font-serif">Edit the Profile</h3>
         <p className="text-xs text-gray-400 mb-10">Update your public profile and clinical contact details below.</p>
         
         <div className="space-y-10">
            <div className="space-y-4">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Change Profile Image</label>
               <div className="border-2 border-dashed border-gray-100 rounded-3xl p-10 flex flex-col items-center justify-center bg-gray-25/30 hover:border-purple-200 transition-colors cursor-pointer group">
                  <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300 mb-4 group-hover:scale-110 transition-transform shadow-sm"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg></div>
                  <p className="text-sm font-bold text-gray-800">Click to upload or drag and drop</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tight">PNG, JPG or WEBP (Max. 5MB)</p>
               </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-25">
               <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Personal Information</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">First Name</label>
                     <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-purple-100 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Last Name</label>
                     <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-purple-100 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                     <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-purple-100 transition-all outline-none" />
                  </div>
               </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-25">
               <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Address</h4>
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Street address</label>
                     <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-purple-100 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">City</label>
                     <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-purple-100 transition-all outline-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Province</label>
                        <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-purple-100 transition-all outline-none" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Postal code</label>
                        <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-purple-100 transition-all outline-none" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex justify-end gap-6 pt-10 mt-6 border-t border-gray-25">
               <button onClick={() => setView('main')} className="px-8 py-4 text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors">Cancel</button>
               <button onClick={handleSave} disabled={saving} className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-200 hover:-translate-y-1 transition-all disabled:opacity-50">
                 {saving ? 'Saving...' : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg> Save Changes</>}
               </button>
            </div>
         </div>
      </div>
    </div>
  </div>
  );
};

export default ProfileView;
