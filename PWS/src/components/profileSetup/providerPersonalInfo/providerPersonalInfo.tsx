import React, { useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { HiOutlineUser } from 'react-icons/hi';
import type { ProviderProfileFormData } from '../../../types/profile';
import { fileToBase64 } from '../../../utils/image';

interface ProviderPersonalInfoProps {
  formData: ProviderProfileFormData;
  setFormData: Dispatch<SetStateAction<ProviderProfileFormData>>;
}

const ProviderPersonalInfo: React.FC<ProviderPersonalInfoProps> = ({ formData, setFormData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64DataUrl = await fileToBase64(file);
      setFormData({ ...formData, profilePhoto: base64DataUrl });
    }
  };

  const initials = () => {
    const first = formData.firstName ? formData.firstName.charAt(0) : '';
    const last = formData.lastName ? formData.lastName.charAt(0) : '';
    return (first + last).toUpperCase() || 'YA'; // Fallback to 'YA' matching the mock if empty, or just blank.
  };

  const displayName = () => {
    if (formData.firstName || formData.lastName) {
      return `${formData.firstName} ${formData.lastName}`.trim();
    }
    return 'Yolanda Adams';
  };

  const displayTitle = () => {
    return formData.professionalTitle || 'Certified PSW';
  };

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl md:text-[28px] font-bold text-gray-900 font-playfair tracking-tight leading-tight">Tell us about yourself</h3>
        <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed font-dm">Your name and photo are the first things clients see on your profile card.</p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-3">
        <div 
          className="size-20 sm:size-24 md:size-28 rounded-full border-2 border-primary flex items-center justify-center cursor-pointer hover:bg-gray-50 duration-300 relative overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
          {formData.profilePhoto ? (
            <img src={formData.profilePhoto} alt="Profile" className="size-full object-cover" />
          ) : (
            <HiOutlineUser className="size-8 text-primary" />
          )}
        </div>
        <div className="text-center space-y-1 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <p className="text-primary font-bold text-[15px] font-dm hover:underline underline-offset-2">Upload photo</p>
          <p className="text-[11px] text-gray-400 font-medium font-dm">JPG or PNG, min 400x400px</p>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/png, image/jpeg" 
          onChange={handlePhotoUpload} 
        />
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] sm:text-[13px] font-bold text-gray-900 font-dm">First name</label>
          <input
            type="text"
            placeholder="Enter your first name"
            value={formData.firstName || ''}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full bg-white border border-primary/40 rounded-xl md:rounded-2xl p-3 sm:p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary duration-300 text-gray-900 font-medium placeholder:text-gray-400 text-sm sm:text-base font-dm shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] sm:text-[13px] font-bold text-gray-900 font-dm">Last name</label>
          <input
            type="text"
            placeholder="Enter your last name"
            value={formData.lastName || ''}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full bg-white border border-gray-200 rounded-xl md:rounded-2xl p-3 sm:p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary duration-300 text-gray-900 font-medium placeholder:text-gray-400 text-sm sm:text-base font-dm shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] sm:text-[13px] font-bold text-gray-900 font-dm">Professional title</label>
          <input
            type="text"
            placeholder="e.g. Certified PSW, Nurse Practitioner"
            value={formData.professionalTitle || ''}
            onChange={(e) => setFormData({ ...formData, professionalTitle: e.target.value })}
            className="w-full bg-white border border-gray-200 rounded-xl md:rounded-2xl p-3 sm:p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary duration-300 text-gray-900 font-medium placeholder:text-gray-400 text-sm sm:text-base font-dm shadow-sm"
          />
          <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium font-dm mt-1">Displayed on your profile card and visible to clients</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[11px] font-bold text-gray-400 tracking-widest uppercase font-dm">PREVIEW</label>
        <div className="border border-gray-200 rounded-xl md:rounded-2xl p-4 sm:p-5 flex items-center gap-4 bg-white shadow-sm">
          {formData.profilePhoto ? (
            <img src={formData.profilePhoto} alt="Profile preview" className="size-12 sm:size-14 rounded-full object-cover" />
          ) : (
            <div className="size-12 sm:size-14 rounded-full bg-[#9333ea] flex items-center justify-center text-white font-bold text-base sm:text-lg tracking-widest shrink-0">
              {initials()}
            </div>
          )}
          <div>
            <h4 className="text-[15px] sm:text-base font-bold text-gray-900 font-dm">{displayName()}</h4>
            <p className="text-[13px] sm:text-sm text-gray-500 font-medium font-dm mt-0.5">{displayTitle()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderPersonalInfo;
