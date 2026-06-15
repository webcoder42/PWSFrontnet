import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import { HiCheck } from 'react-icons/hi';
import type { ProfileFormData } from '../../../types/profile';
import { FaBath, FaUserFriends, FaTshirt, FaWalking, FaStethoscope, FaCut, FaBroom, FaUtensils, FaCar } from 'react-icons/fa';

const CareConditionsData = [
  "Alzheimer's Care", "Cancer Care", "Dementia Care",
  "Diabetes Care", "Elder Care", "Palliative Care",
  "Parkinson's Care", "Post-Surgery Care", "Senior Care",
  "Stroke Care"
];

const CareServicesData = [
  { id: 'Bathing & Toileting', Icon: FaBath, color: 'text-blue-500 bg-blue-50/50' },
  { id: 'Companionship', Icon: FaUserFriends, color: 'text-orange-400 bg-orange-50/50' },
  { id: 'Dressing', Icon: FaTshirt, color: 'text-indigo-400 bg-indigo-50/50' },
  { id: 'Exercise & Mobility', Icon: FaWalking, color: 'text-green-500 bg-green-50/50' },
  { id: 'General Care', Icon: FaStethoscope, color: 'text-teal-500 bg-teal-50/50' },
  { id: 'Hygiene & Grooming', Icon: FaCut, color: 'text-pink-500 bg-pink-50/50' },
  { id: 'Housekeeping', Icon: FaBroom, color: 'text-amber-600 bg-amber-50/50' },
  { id: 'Meal Preparation', Icon: FaUtensils, color: 'text-red-400 bg-red-50/50' },
  { id: 'Transportation', Icon: FaCar, color: 'text-sky-500 bg-sky-50/50' }
];

interface CareNeedsProps {
  formData: ProfileFormData;
  setFormData: Dispatch<SetStateAction<ProfileFormData>>;
  isFamilyMember?: boolean;
}

const CareNeeds: React.FC<CareNeedsProps> = ({ formData, setFormData, isFamilyMember }) => {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-xl sm:text-3xl font-bold text-gray-900 font-playfair tracking-tight leading-tight">{isFamilyMember ? "What care services are they looking for?" : "What care services are you looking for?"}</h3>
        <div>
          <p className="text-sm sm:text-lg text-gray-400 font-medium leading-relaxed font-dm text-balance">Select all that apply. This helps us match {isFamilyMember ? "them" : "you"} with PSWs who specialize in {isFamilyMember ? "their" : "your"} needs.</p>
          <p className="text-xs text-gray-400 font-medium font-dm mt-1.5">(Select all that apply)</p>
        </div>
      </div>

      <div className="space-y-10 sm:space-y-12">
        <div className="space-y-6">
          <h4 className="text-xs sm:text-sm lg:text-[15px] font-dm font-bold text-gray-900 uppercase tracking-widest">Care conditions</h4>
          <div className="flex flex-wrap gap-3 lg:gap-4">
            {CareConditionsData.map((condition) => {
              const isSelected = formData.careConditions.includes(condition);
              return (
                <button
                  key={condition}
                  onClick={() => {
                    if (isSelected) {
                      setFormData({ ...formData, careConditions: formData.careConditions.filter((c: string) => c !== condition) });
                    } else {
                      setFormData({ ...formData, careConditions: [...formData.careConditions, condition] });
                    }
                  }}
                  className={clsx(
                    "px-6 sm:px-10 py-3 rounded-full text-sm sm:text-base font-bold font-dm duration-300 border-2 active:scale-[0.98] text-balance",
                    isSelected
                      ? "border-primary bg-primary-extralight text-primary"
                      : "border-gray-100 bg-white text-gray-500 hover:border-primary/20 hover:bg-gray-50"
                  )}
                >
                  {condition}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-xs sm:text-sm lg:text-[15px] font-dm font-bold text-gray-900 uppercase tracking-widest">Care services needed</h4>
            <p className="text-xs lg:text-[13px] text-gray-400 font-medium font-dm mt-1.5">Scroll down and click all that apply</p>
          </div>
          <div className="space-y-4 lg:space-y-5 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar no-scrollbar">
            {CareServicesData.map((service) => {
              const isSelected = formData.careServices.includes(service.id);
              return (
                <button
                  key={service.id}
                  onClick={() => {
                    if (isSelected) {
                      setFormData({ ...formData, careServices: formData.careServices.filter((s: string) => s !== service.id) });
                    } else {
                      setFormData({ ...formData, careServices: [...formData.careServices, service.id] });
                    }
                  }}
                  className={clsx(
                    "w-full flex items-center justify-between p-4 sm:p-5 lg:p-6 rounded-xl md:rounded-2xl duration-300 border-2 active:scale-[0.99] text-left",
                    isSelected
                      ? "border-primary bg-primary-extralight"
                      : "border-gray-100 bg-white hover:border-primary/20 hover:bg-gray-50/50"
                  )}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className={clsx("size-12 sm:size-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm shrink-0 border border-gray-100/50", service.color)}>
                      <service.Icon className="size-5 sm:size-7" />
                    </div>
                    <span className={clsx(
                      "text-base sm:text-xl font-bold font-dm",
                      isSelected ? "text-gray-900" : "text-gray-700"
                    )}>
                      {service.id}
                    </span>
                  </div>

                  <div className={clsx(
                    "size-6 sm:size-8 rounded-md border-2 flex items-center justify-center shrink-0 duration-300",
                    isSelected
                      ? "bg-primary border-primary text-white"
                      : "bg-transparent border-gray-300/80 hover:border-gray-400"
                  )}>
                    <HiCheck className={clsx("size-4 sm:size-5 duration-300", isSelected ? "scale-100 opacity-100" : "scale-50 opacity-0")} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareNeeds;
