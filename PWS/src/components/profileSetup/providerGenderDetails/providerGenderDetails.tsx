import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import { HiCheck, HiOutlineInformationCircle } from 'react-icons/hi';
import { IoFemale, IoMale } from 'react-icons/io5';
import type { ProviderProfileFormData } from '../../../types/profile';

interface ProviderGenderDetailsProps {
  formData: ProviderProfileFormData;
  setFormData: Dispatch<SetStateAction<ProviderProfileFormData>>;
}

const ProviderGenderDetails: React.FC<ProviderGenderDetailsProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl md:text-[28px] font-bold text-gray-900 font-playfair tracking-tight leading-tight">What's your gender?</h3>
        <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed font-dm">Some clients prefer a caregiver of a specific gender. This helps us make the best match for everyone.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl p-4 sm:p-5 flex gap-3 sm:gap-4 shadow-sm">
        <div className="size-5 sm:size-6 rounded-full bg-primary-extralight flex items-center justify-center text-primary shrink-0 mt-0.5">
          <HiOutlineInformationCircle className="size-3.5 sm:size-4" />
        </div>
        <p className="text-[13px] sm:text-[14px] text-gray-500 font-medium font-dm leading-relaxed">
          Gender is used for client matching only and never affects your pay or job opportunities.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <div 
          onClick={() => setFormData({ ...formData, gender: 'Female' })}
          className={clsx(
            "relative border-2 rounded-xl md:rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center gap-3 sm:gap-4 cursor-pointer duration-300 bg-white",
            formData.gender === 'Female' ? "border-primary shadow-sm" : "border-gray-100 hover:border-gray-200"
          )}
        >
          {formData.gender === 'Female' && (
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 size-5 sm:size-6 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
              <HiCheck className="size-3 sm:size-3.5" />
            </div>
          )}
          <IoFemale className={clsx(
            "size-10 sm:size-12 duration-300",
            formData.gender === 'Female' ? "text-primary" : "text-gray-300"
          )} />
          <span className={clsx(
            "text-[15px] sm:text-base font-bold font-dm duration-300",
            formData.gender === 'Female' ? "text-primary" : "text-gray-500"
          )}>Female</span>
        </div>

        <div 
          onClick={() => setFormData({ ...formData, gender: 'Male' })}
          className={clsx(
            "relative border-2 rounded-xl md:rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center gap-3 sm:gap-4 cursor-pointer duration-300 bg-white",
            formData.gender === 'Male' ? "border-primary shadow-sm" : "border-gray-100 hover:border-gray-200"
          )}
        >
          {formData.gender === 'Male' && (
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 size-5 sm:size-6 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
              <HiCheck className="size-3 sm:size-3.5" />
            </div>
          )}
          <IoMale className={clsx(
            "size-10 sm:size-12 duration-300",
            formData.gender === 'Male' ? "text-primary" : "text-gray-300"
          )} />
          <span className={clsx(
            "text-[15px] sm:text-base font-bold font-dm duration-300",
            formData.gender === 'Male' ? "text-primary" : "text-gray-500"
          )}>Male</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] sm:text-[13px] font-bold text-gray-900 font-dm">Pronouns (optional)</label>
        <input
          type="text"
          placeholder='e.g. "She/Her" or "He/Him"'
          value={formData.pronouns || ''}
          onChange={(e) => setFormData({ ...formData, pronouns: e.target.value })}
          className="w-full bg-white border border-gray-200 rounded-xl md:rounded-2xl p-3 sm:p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary duration-300 text-gray-900 font-medium placeholder:text-gray-400 text-sm sm:text-base font-dm shadow-sm"
        />
        <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium font-dm mt-1">Shown on your profile to clients if provided.</p>
      </div>

      <div className="border border-gray-200 rounded-xl md:rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm bg-white">
        <span className="font-medium text-[13px] sm:text-base text-gray-900 font-dm">Show gender on my public profile</span>
        <button 
          onClick={() => setFormData({ ...formData, showGender: !formData.showGender })}
          className={clsx(
            "w-12 sm:w-14 h-6 sm:h-7 rounded-full relative duration-300 outline-none",
            formData.showGender ? "bg-primary" : "bg-gray-200"
          )}
        >
          <div className={clsx(
            "absolute top-1/2 -translate-y-1/2 size-4 sm:size-5 bg-white rounded-full duration-300 shadow-sm",
            formData.showGender ? "left-[calc(100%-22px)] sm:left-[calc(100%-24px)]" : "left-1"
          )} />
        </button>
      </div>
    </div>
  );
};

export default ProviderGenderDetails;
