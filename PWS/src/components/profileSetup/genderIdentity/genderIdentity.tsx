import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import { HiInformationCircle, HiCheckCircle } from 'react-icons/hi';
import type { ProfileFormData } from '../../../types/profile';
import { IoMale, IoFemale } from 'react-icons/io5';

const GenderData = [
  { id: 'Male', Icon: IoMale },
  { id: 'Female', Icon: IoFemale }
];

interface GenderIdentityProps {
  formData: ProfileFormData;
  setFormData: Dispatch<SetStateAction<ProfileFormData>>;
  isFamilyMember?: boolean;
}

const GenderIdentity: React.FC<GenderIdentityProps> = ({ formData, setFormData, isFamilyMember }) => {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-xl sm:text-3xl font-bold text-gray-900 font-playfair tracking-tight leading-tight">{isFamilyMember ? "What's their gender?" : "What's your gender?"}</h3>
        <p className="text-sm sm:text-lg text-gray-400 font-medium leading-relaxed font-dm text-balance">To give {isFamilyMember ? "them" : "you"} a better experience we need to know {isFamilyMember ? "their" : "your"} gender.</p>
      </div>

      <div className="bg-primary-extralight rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 border border-primary/10">
        <HiInformationCircle className="size-5 sm:size-6 text-primary shrink-0" />
        <p className="text-xs sm:text-sm text-primary/80 font-medium font-dm leading-relaxed">
          This information helps us match {isFamilyMember ? "them" : "you"} with the appropriate care provider.
        </p>
      </div>

      <div className="space-y-10">
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {GenderData.map((option) => (
            <button
              key={option.id}
              onClick={() => setFormData({ ...formData, gender: option.id })}
              className={clsx(
                'relative w-full rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center gap-4 sm:gap-5 duration-300 border-2 active:scale-[0.98]',
                formData.gender === option.id
                  ? 'border-primary bg-primary-extralight shadow-sm'
                  : 'border-gray-100 bg-white hover:border-primary/20 hover:bg-gray-50/50'
              )}
            >
              {formData.gender === option.id && (
                <HiCheckCircle className="absolute top-4 sm:top-5 right-4 sm:right-5 text-primary size-6 sm:size-8 animate-in zoom-in duration-300" />
              )}
              <option.Icon className={clsx(
                'size-16 sm:size-24 duration-300',
                formData.gender === option.id ? 'text-primary' : 'text-gray-900'
              )} />
              <span className={clsx(
                'text-lg sm:text-3xl font-bold font-dm tracking-wide duration-300',
                formData.gender === option.id ? 'text-primary' : 'text-gray-900'
              )}>
                {option.id}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Pronouns (optional)</label>
          <input
            type="text"
            placeholder='e.g. "He/Him" or "She/Her"'
            value={formData.pronouns}
            onChange={(e) => setFormData({ ...formData, pronouns: e.target.value })}
            className="mt-2 w-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium placeholder:text-gray-400 text-base"
          />
          <p className="text-xs text-gray-400 font-medium ml-1 font-dm">{isFamilyMember ? "Their" : "Your"} pronouns will be visible to {isFamilyMember ? "their" : "your"} PSW.</p>
        </div>
      </div>
    </div>
  );
};

export default GenderIdentity;
