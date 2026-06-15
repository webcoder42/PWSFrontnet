import React, { useState, useRef, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import { HiChevronDown } from 'react-icons/hi';
import type { ProviderProfileFormData } from '../../../types/profile';

const YearsOptions = ['Less than 1 Year', '1 Year', '2 Years', '3 Years', '4 Years', '5 Years', '6 Years', '7 Years', '8 Years', '9 Years', '10+ Years'];

const SpecializationOptions = [
  'Elder Care', 'Alzheimer\'s Care', 'Dementia Care', 'Cancer Care',
  'Diabetes Care', 'Palliative Care', 'Parkinson\'s Care', 'Post-Surgery Care',
  'Senior Care', 'Stroke Care'
];

interface ProviderExperienceDetailsProps {
  formData: ProviderProfileFormData;
  setFormData: Dispatch<SetStateAction<ProviderProfileFormData>>;
}

const ProviderExperienceDetails: React.FC<ProviderExperienceDetailsProps> = ({ formData, setFormData }) => {
  const [isYearsDropdownOpen, setIsYearsDropdownOpen] = useState(false);
  const yearsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearsRef.current && !yearsRef.current.contains(event.target as Node)) {
        setIsYearsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSpecialization = (spec: string) => {
    const currentSpecs = formData.specializations || [];
    if (currentSpecs.includes(spec)) {
      setFormData({ ...formData, specializations: currentSpecs.filter(s => s !== spec) });
    } else {
      setFormData({ ...formData, specializations: [...currentSpecs, spec] });
    }
  };

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl md:text-[28px] font-bold text-gray-900 font-playfair tracking-tight leading-tight">Your professional experience</h3>
        <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed font-dm">Clients use your experience and specializations to decide who to book. Be as thorough as possible.</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-[11px] sm:text-[13px] font-bold text-gray-900 font-dm">Years of experience</label>
          <div className="relative" ref={yearsRef}>
            <div 
              onClick={() => setIsYearsDropdownOpen(!isYearsDropdownOpen)}
              className="flex items-center justify-between w-full bg-white border border-primary/40 rounded-xl md:rounded-2xl p-3 sm:p-4 cursor-pointer hover:border-primary/60 duration-300 shadow-sm"
            >
              <span className="text-sm sm:text-base font-medium font-dm text-gray-900">{formData.yearsExperience || 'Select years of experience'}</span>
              <HiChevronDown className={clsx("size-4 sm:size-5 text-gray-400 duration-300", isYearsDropdownOpen && "rotate-180")} />
            </div>
            {isYearsDropdownOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-xl shadow-logs border border-gray-100 overflow-hidden z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                {YearsOptions.map((year, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setFormData({ ...formData, yearsExperience: year });
                      setIsYearsDropdownOpen(false);
                    }}
                    className={clsx(
                      "px-4 py-3 cursor-pointer duration-200 text-sm sm:text-base font-medium font-dm",
                      formData.yearsExperience === year ? "bg-primary/5 text-primary" : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] sm:text-[13px] font-bold text-gray-900 font-dm block">Care specializations</label>
            <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium font-dm block mt-0.5">Select all areas you are trained or experienced in</span>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {SpecializationOptions.map((spec, i) => {
              const isSelected = (formData.specializations || []).includes(spec);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleSpecialization(spec)}
                  className={clsx(
                    "px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[12px] sm:text-[13px] font-bold font-dm duration-300 border",
                    isSelected 
                      ? "bg-primary-extralight border-primary text-primary" 
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                  )}
                >
                  {spec}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] sm:text-[13px] font-bold text-gray-900 font-dm block">Professional bio</label>
            <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium font-dm block mt-0.5">Introduce yourself to potential clients (50–300 characters)</span>
          </div>
          <div className="relative">
            <textarea
              value={formData.professionalBio || ''}
              onChange={(e) => {
                if (e.target.value.length <= 300) {
                  setFormData({ ...formData, professionalBio: e.target.value });
                }
              }}
              placeholder="e.g. I am a compassionate PSW with over 8 years of experience in elder care and dementia support..."
              className="w-full bg-white border border-gray-200 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary focus:ring-1 focus:ring-primary duration-300 text-gray-900 font-medium placeholder:text-gray-400 text-sm sm:text-base font-dm shadow-sm min-h-[140px] resize-none"
            />
            <div className="absolute bottom-3 right-4 text-[10px] sm:text-[11px] font-medium font-dm text-gray-400">
              {(formData.professionalBio || '').length} / 300
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderExperienceDetails;
