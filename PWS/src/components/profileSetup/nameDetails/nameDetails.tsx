import React, { useRef } from 'react';
import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { clsx } from 'clsx';
import { HiOutlineUser, HiOutlineCamera } from 'react-icons/hi';
import type { ProfileFormData, ProfileErrors } from '../../../types/profile';
import { fileToBase64 } from '../../../utils/image';

interface NameDetailsProps {
  formData: ProfileFormData;
  setFormData: Dispatch<SetStateAction<ProfileFormData>>;
  errors: ProfileErrors;
  handleUsernameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isFamilyMember?: boolean;
}

const NameDetails: React.FC<NameDetailsProps> = ({
  formData,
  setFormData,
  errors,
  handleUsernameChange,
  isFamilyMember
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64DataUrl = await fileToBase64(file);
      setFormData({ ...formData, profilePhoto: base64DataUrl });
    }
  };

  const getInitials = () => {
    const first = formData.firstName ? formData.firstName.charAt(0) : '';
    const last = formData.lastName ? formData.lastName.charAt(0) : '';
    return (first + last).toUpperCase() || 'JS';
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h3 className="text-xl sm:text-3xl font-bold text-gray-900 font-playfair tracking-tight leading-tight">
          {isFamilyMember ? "What's their name?" : "What's your name?"}
        </h3>
        <p className="text-sm sm:text-lg text-gray-400 font-medium leading-relaxed font-dm text-balance">
          {isFamilyMember 
            ? "Your name and photo help caregivers identify who they'll be supporting." 
            : "Your name and photo help our team and caregivers identify you."}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        <div 
          className="relative size-24 sm:size-28 md:size-32 rounded-full border-2 border-primary/20 flex items-center justify-center cursor-pointer hover:bg-gray-50 duration-300 group overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
          {formData.profilePhoto ? (
            <img src={formData.profilePhoto} alt="Profile" className="size-full object-cover" />
          ) : (
            <div className="size-full bg-gray-50 flex items-center justify-center">
              <HiOutlineUser className="size-10 text-gray-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
            <HiOutlineCamera className="size-8 text-white" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-primary font-bold text-[14px] sm:text-[15px] font-dm hover:underline underline-offset-4"
          >
            {formData.profilePhoto ? "Change photo" : "Upload photo"}
          </button>
          <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium font-dm uppercase tracking-wider">JPG, PNG · Min 400px</p>
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
          <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">First name</label>
          <input
            type="text"
            placeholder={isFamilyMember ? "Enter their first name" : "Enter your first name"}
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium placeholder:text-gray-300 text-sm sm:text-base shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Last name</label>
          <input
            type="text"
            placeholder={isFamilyMember ? "Enter their last name" : "Enter your last name"}
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium placeholder:text-gray-300 text-sm sm:text-base shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className={clsx(
            'text-xs sm:text-sm font-dm font-bold uppercase tracking-widest ml-1 opacity-60',
            errors.username ? 'text-red-500 opacity-100' : 'text-gray-900'
          )}>Username (optional)</label>
          <div className="relative">
            <input
              type="text"
              placeholder="@johnsmith"
              value={formData.username}
              onChange={handleUsernameChange}
              className={clsx(
                'w-full bg-white border-2 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none duration-300 text-gray-900 font-medium placeholder:text-gray-300 shadow-sm text-sm sm:text-base',
                errors.username ? 'border-red-500 focus:border-red-600' : 'border-primary/5 focus:border-primary'
              )}
            />
          </div>
          {errors.username ? (
            <p className="text-xs text-red-500 font-bold ml-1 font-dm mt-1">{errors.username}</p>
          ) : (
            <p className="text-[10px] text-gray-400 font-bold ml-1 uppercase tracking-wider font-dm mt-1">12-20 chars, letters and numbers only</p>
          )}
        </div>
      </div>

      <div className="pt-4 space-y-4">
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 font-dm block underline underline-offset-4 decoration-primary/30">PREVIEW</span>
        <div className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-5 sm:p-6 flex items-center gap-5 shadow-sm overflow-hidden">
          {formData.profilePhoto ? (
            <img src={formData.profilePhoto} alt="Preview" className="size-14 sm:size-16 rounded-full object-cover shadow-md border-2 border-primary/10" />
          ) : (
            <div className="size-14 sm:size-16 shrink-0 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg shadow-primary/20">
              {getInitials()}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 font-playfair leading-none truncate">
              {formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}`.trim() : 'John Smith'}
            </h4>
            <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1.5 font-dm truncate tracking-tight">
              {formData.username ? (formData.username.startsWith('@') ? formData.username : `@${formData.username}`) : 'myPSW Member'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameDetails;
