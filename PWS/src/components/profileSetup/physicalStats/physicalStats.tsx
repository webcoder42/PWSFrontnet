import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import { HiInformationCircle } from 'react-icons/hi';
import type { ProfileFormData } from '../../../types/profile';

interface PhysicalStatsProps {
  formData: ProfileFormData;
  setFormData: Dispatch<SetStateAction<ProfileFormData>>;
  isFamilyMember?: boolean;
}

const PhysicalStats: React.FC<PhysicalStatsProps> = ({ formData, setFormData, isFamilyMember }) => {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-xl sm:text-3xl font-bold text-gray-900 font-playfair tracking-tight leading-tight">{isFamilyMember ? "Tell us about their physical stats" : "Tell us about your physical stats"}</h3>
        <p className="text-sm sm:text-lg text-gray-400 font-medium leading-relaxed font-dm text-balance">This helps PSWs provide appropriate physical assistance and ensures {isFamilyMember ? "their" : "your"} safety.</p>
      </div>

      <div className="bg-primary-extralight rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 border border-primary/10">
        <HiInformationCircle className="size-5 sm:size-6 text-primary shrink-0" />
        <p className="text-xs sm:text-sm text-primary/80 font-medium font-dm leading-relaxed">
          This information helps us match {isFamilyMember ? "them" : "you"} with the appropriate care provider.
        </p>
      </div>

      <div className="space-y-8">
        <div className="border border-gray-100/80 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 space-y-10 shadow-sm bg-white">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] sm:text-sm font-bold text-primary/60 uppercase tracking-widest font-dm flex items-center">
              Height <span className="text-primary ml-3 lowercase tracking-normal bg-primary/5 px-3 py-1.5 rounded-md text-sm sm:text-base border border-primary/10">
                {formData.heightUnit === 'ft'
                  ? `${Math.floor(formData.heightValue / 12)}'${formData.heightValue % 12}"`
                  : `${formData.heightValue} cm`}
              </span>
            </h4>
            <div className="flex bg-gray-50 border border-gray-100 rounded-full p-1 shadow-inner">
              <button
                onClick={() => setFormData({ ...formData, heightUnit: 'cm', heightValue: formData.heightUnit === 'ft' ? Math.round(formData.heightValue * 2.54) : formData.heightValue })}
                className={clsx("px-4 lg:px-5 py-1.5 rounded-full text-xs font-bold font-dm duration-300", formData.heightUnit === 'cm' ? 'bg-white shadow-sm text-gray-900 border border-gray-100/50' : 'text-gray-400')}
              >
                cm
              </button>
              <button
                onClick={() => setFormData({ ...formData, heightUnit: 'ft', heightValue: formData.heightUnit === 'cm' ? Math.round(formData.heightValue / 2.54) : formData.heightValue })}
                className={clsx("px-4 lg:px-5 py-1.5 rounded-full text-xs font-bold font-dm duration-300", formData.heightUnit === 'ft' ? 'bg-white shadow-sm text-gray-900 border border-gray-100/50' : 'text-gray-400')}
              >
                ft
              </button>
            </div>
          </div>

          <div className="px-2 space-y-4">
            <input
              type="range"
              min={formData.heightUnit === 'ft' ? "48" : "120"}
              max={formData.heightUnit === 'ft' ? "84" : "215"}
              value={formData.heightValue}
              onChange={(e) => setFormData({ ...formData, heightValue: parseInt(e.target.value) })}
              className="w-full h-3 bg-bg-slider rounded-full appearance-none outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-8 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg active:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:cursor-grabbing [&::-webkit-slider-thumb]:duration-200"
              style={{
                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((formData.heightValue - (formData.heightUnit === 'ft' ? 48 : 120)) / (formData.heightUnit === 'ft' ? 36 : 95)) * 100}%, #e2dcfc ${((formData.heightValue - (formData.heightUnit === 'ft' ? 48 : 120)) / (formData.heightUnit === 'ft' ? 36 : 95)) * 100}%, #e2dcfc 100%)`
              }}
            />
            <div className="flex justify-between items-center text-[10px] sm:text-sm font-bold text-gray-300 font-dm px-1">
              {formData.heightUnit === 'ft' ? (
                <><span>4'0"</span><span>5'0"</span><span>6'0"</span><span>7'0"</span></>
              ) : (
                <><span>120</span><span>150</span><span>180</span><span>215</span></>
              )}
            </div>
          </div>
        </div>

        <div className="border border-gray-100/80 rounded-2xl md:rounded-6xl p-6 sm:p-8 md:p-10 space-y-10 shadow-sm bg-white">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] sm:text-sm font-bold text-primary/60 uppercase tracking-widest font-dm flex items-center">
              Weight <span className="text-primary ml-3 lowercase tracking-normal bg-primary/5 px-3 py-1.5 rounded-md text-sm sm:text-base border border-primary/10">
                {formData.weightValue} {formData.weightUnit}
              </span>
            </h4>
            <div className="flex bg-gray-50 border border-gray-100 rounded-full p-1 shadow-inner">
              <button
                onClick={() => setFormData({ ...formData, weightUnit: 'kg', weightValue: formData.weightUnit === 'lbs' ? Math.round(formData.weightValue / 2.205) : formData.weightValue })}
                className={clsx("px-4 lg:px-5 py-1.5 rounded-full text-xs font-bold font-dm duration-300", formData.weightUnit === 'kg' ? 'bg-white shadow-sm text-gray-900 border border-gray-100/50' : 'text-gray-400')}
              >
                kg
              </button>
              <button
                onClick={() => setFormData({ ...formData, weightUnit: 'lbs', weightValue: formData.weightUnit === 'kg' ? Math.round(formData.weightValue * 2.205) : formData.weightValue })}
                className={clsx("px-4 lg:px-5 py-1.5 rounded-full text-xs font-bold font-dm duration-300", formData.weightUnit === 'lbs' ? 'bg-white shadow-sm text-gray-900 border border-gray-100/50' : 'text-gray-400')}
              >
                lbs
              </button>
            </div>
          </div>

          <div className="px-2 space-y-4">
            <input
              type="range"
              min={formData.weightUnit === 'lbs' ? "80" : "35"}
              max={formData.weightUnit === 'lbs' ? "250" : "115"}
              value={formData.weightValue}
              onChange={(e) => setFormData({ ...formData, weightValue: parseInt(e.target.value) })}
              className="w-full h-3 bg-bg-slider rounded-full appearance-none outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-8 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg active:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:cursor-grabbing [&::-webkit-slider-thumb]:duration-200"
              style={{
                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((formData.weightValue - (formData.weightUnit === 'lbs' ? 80 : 35)) / (formData.weightUnit === 'lbs' ? 170 : 80)) * 100}%, #e2dcfc ${((formData.weightValue - (formData.weightUnit === 'lbs' ? 80 : 35)) / (formData.weightUnit === 'lbs' ? 170 : 80)) * 100}%, #e2dcfc 100%)`
              }}
            />
            <div className="flex justify-between items-center text-[10px] sm:text-sm font-bold text-gray-300 font-dm px-1">
              {formData.weightUnit === 'lbs' ? (
                <><span>80</span><span>120</span><span>160</span><span>200</span><span>240</span></>
              ) : (
                <><span>35</span><span>55</span><span>75</span><span>95</span><span>115</span></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalStats;
