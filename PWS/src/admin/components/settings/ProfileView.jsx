import React, { useMemo, useState } from 'react';
import Breadcrumb from './Breadcrumb';
import { useUser } from '../../../context/UserContext';
import { fileToBase64 } from '../../../utils/image';
import { updateUserProfileAPI, uploadImageAPI } from '../../../utils/api';

const ProfileView = ({ setView }) => {
  const { rawUser, profile, setUser } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState(() => ({
    firstName: rawUser?.firstName || '',
    lastName: rawUser?.lastName || '',
    phone: rawUser?.phone || '',
    street: rawUser?.address?.street || '',
    city: rawUser?.address?.city || '',
    province: rawUser?.address?.province || '',
    postalCode: rawUser?.address?.postalCode || '',
    photoUrl: rawUser?.photoUrl || '',
  }));

  const fullName = useMemo(
    () => `${form.firstName} ${form.lastName}`.trim() || profile?.name || 'User',
    [form.firstName, form.lastName, profile?.name],
  );

  const initials = useMemo(() => {
    const parts = fullName.split(' ').filter(Boolean);
    if (!parts.length) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
  }, [fullName]);

  const handleImageFile = async (file) => {
    if (!file) return;
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload PNG, JPG, or WEBP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be 5MB or less.');
      return;
    }

    try {
      setUploadingImage(true);
      const imageBase64 = await fileToBase64(file);
      const uploadRes = await uploadImageAPI(imageBase64, 'mypsw/profile-images');
      const secureUrl = uploadRes?.data?.secureUrl;
      if (!secureUrl) {
        throw new Error('Image URL missing after upload.');
      }
      setForm((prev) => ({ ...prev, photoUrl: secureUrl }));
    } catch (error) {
      console.error(error);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!rawUser?._id) {
      alert('User session missing. Please login again.');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        photoUrl: form.photoUrl,
        address: {
          street: form.street,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
        },
      };

      const response = await updateUserProfileAPI(rawUser._id, payload);
      if (response?.data) {
        setUser(response.data);
      }
      setView('main');
    } catch (error) {
      console.error(error);
      alert('Could not save profile changes.');
    } finally {
      setIsSaving(false);
    }
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
              {form.photoUrl ? (
                <img src={form.photoUrl} className="w-32 h-32 rounded-[2rem] border-4 border-purple-50 shadow-lg object-cover" alt="Profile" />
              ) : (
                <div className="w-32 h-32 rounded-[2rem] border-4 border-purple-50 shadow-lg bg-purple-600 text-white flex items-center justify-center text-3xl font-bold">
                  {initials}
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{fullName}</h3>
            <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-10">{profile?.role?.replace(/_/g, ' ') || 'Member'}</p>

            <div className="w-full space-y-6 text-left">
              <div className="flex items-start gap-4">
                <div className="text-purple-600 mt-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></div>
                <div><p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</p><p className="text-sm font-bold text-gray-800">{form.phone || 'Not provided'}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-purple-600 mt-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
                <div><p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Address</p><p className="text-sm font-bold text-gray-800 max-w-[180px]">{`${form.street}, ${form.city}, ${form.province}`.replace(/^,\s*|,\s*$/g, '') || 'Not provided'}</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-2 font-serif">Edit the Profile</h3>
          <p className="text-xs text-gray-400 mb-10">Update your public profile and clinical contact details below.</p>

          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Change Profile Image</label>
              <label className="border-2 border-dashed border-gray-100 rounded-3xl p-10 flex flex-col items-center justify-center bg-gray-25/30 hover:border-purple-200 transition-colors cursor-pointer group">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => handleImageFile(e.target.files?.[0])}
                />
                <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300 mb-4 group-hover:scale-110 transition-transform shadow-sm"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg></div>
                <p className="text-sm font-bold text-gray-800">{uploadingImage ? 'Uploading image...' : 'Click to upload or drag and drop'}</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tight">PNG, JPG or WEBP (Max. 5MB)</p>
              </label>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-25">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">First Name</label>
                  <input type="text" value={form.firstName} onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-purple-100 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Last Name</label>
                  <input type="text" value={form.lastName} onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-purple-100 transition-all outline-none" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-purple-100 transition-all outline-none" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-25">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Address</h4>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Street address</label>
                  <input type="text" value={form.street} onChange={(e) => setForm((prev) => ({ ...prev, street: e.target.value }))} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-purple-100 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">City</label>
                  <input type="text" value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-purple-100 transition-all outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Province</label>
                    <input type="text" value={form.province} onChange={(e) => setForm((prev) => ({ ...prev, province: e.target.value }))} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-purple-100 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest ml-1">Postal code</label>
                    <input type="text" value={form.postalCode} onChange={(e) => setForm((prev) => ({ ...prev, postalCode: e.target.value }))} className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-purple-100 transition-all outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-6 pt-10 mt-6 border-t border-gray-25">
              <button onClick={() => setView('main')} className="px-8 py-4 text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors">Cancel</button>
              <button
                onClick={handleSave}
                disabled={isSaving || uploadingImage}
                className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-200 hover:-translate-y-1 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
