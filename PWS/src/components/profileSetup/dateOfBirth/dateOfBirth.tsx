import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { HiChevronDown, HiGift, HiInformationCircle } from 'react-icons/hi';
import type { ProfileFormData } from '../../../types/profile';

interface DateOfBirthProps {
  formData: ProfileFormData;
  setFormData: Dispatch<SetStateAction<ProfileFormData>>;
  isFamilyMember?: boolean;
}

const DateOfBirth: React.FC<DateOfBirthProps> = ({ formData, setFormData, isFamilyMember }) => {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-xl sm:text-3xl font-bold text-gray-900 font-playfair tracking-tight leading-tight">{isFamilyMember ? "When were they born?" : "When were you born?"}</h3>
        <p className="text-sm sm:text-lg text-gray-400 font-medium leading-relaxed font-dm text-balance">{isFamilyMember ? "Their" : "Your"} age helps us recommend care services that are right for {isFamilyMember ? "them" : "you"}.</p>
      </div>

      <div className="bg-primary-extralight rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 border border-primary/10">
        <HiInformationCircle className="size-5 sm:size-6 text-primary shrink-0" />
        <p className="text-xs sm:text-sm text-primary/80 font-medium font-dm leading-relaxed">
          This information helps us match {isFamilyMember ? "them" : "you"} with the appropriate care provider.
        </p>
      </div>

      <div className="space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_140px] gap-5">
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Month</label>
            <div className="relative">
              <select
                value={formData.dobMonth}
                onChange={(e) => setFormData({ ...formData, dobMonth: e.target.value })}
                className="w-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium appearance-none text-base cursor-pointer"
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <HiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Day</label>
            <input
              type="number"
              placeholder="10"
              min="1"
              max="31"
              value={formData.dobDay}
              onChange={(e) => setFormData({ ...formData, dobDay: e.target.value })}
              className="w-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium placeholder:text-gray-300 text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Year</label>
            <input
              type="number"
              placeholder="1950"
              value={formData.dobYear}
              onChange={(e) => setFormData({ ...formData, dobYear: e.target.value })}
              className="w-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium placeholder:text-gray-300 text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div className="border-2 border-gray-100/50 rounded-2xl md:rounded-4xl p-6 sm:p-8 flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <p className="text-[10px] sm:text-xs font-bold text-primary/60 uppercase tracking-widest font-dm">Calculated Age</p>
            <h4 className="text-3xl sm:text-5xl font-bold text-gray-900 font-playfair tracking-tight">
              {formData.dobYear && !isNaN(parseInt(formData.dobYear)) && formData.dobYear.length === 4
                ? `${new Date().getFullYear() - parseInt(formData.dobYear)} years old`
                : '-- years old'}
            </h4>
          </div>
          <div className="size-16 sm:size-20 bg-primary-extralight rounded-full flex items-center justify-center shadow-inner shrink-0 ml-4">
            <HiGift className="size-8 text-primary" />
          </div>
        </div>

        <div className="pt-6 w-full space-y-4">
          <input
            type="range"
            min="1920"
            max="2010"
            value={formData.dobYear ? Math.min(Math.max(parseInt(formData.dobYear) || 1950, 1920), 2010) : 1974}
            onChange={(e) => setFormData({ ...formData, dobYear: e.target.value })}
            className="w-full h-3 bg-bg-slider rounded-full appearance-none outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-8 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg active:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:cursor-grabbing [&::-webkit-slider-thumb]:duration-200"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((Math.min(Math.max(parseInt(formData.dobYear || '1974') || 1950, 1920), 2010) - 1920) / (2010 - 1920)) * 100}%, #e2dcfc ${((Math.min(Math.max(parseInt(formData.dobYear || '1974') || 1950, 1920), 2010) - 1920) / (2010 - 1920)) * 100}%, #e2dcfc 100%)`
            }}
          />
          <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-gray-400 font-dm px-1">
            <span>1920</span>
            <span>2010</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateOfBirth;
