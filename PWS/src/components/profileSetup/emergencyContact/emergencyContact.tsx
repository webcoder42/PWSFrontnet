import React, { useState, useEffect, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import { HiChevronDown, HiPlus } from 'react-icons/hi';
import type { ProfileFormData, EmergencyContact as IEmergencyContact } from '../../../types/profile';
const CountriesData = [
  { code: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
];

interface EmergencyContactProps {
  formData: ProfileFormData;
  setFormData: Dispatch<SetStateAction<ProfileFormData>>;
  isFamilyMember?: boolean;
}

const EmergencyContact: React.FC<EmergencyContactProps> = ({ formData, setFormData, isFamilyMember }) => {
  const [isEmergencyCountryOpen, setIsEmergencyCountryOpen] = useState(false);
  const emergencyCountryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emergencyCountryRef.current && !emergencyCountryRef.current.contains(event.target as Node)) {
        setIsEmergencyCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-xl capitalize sm:text-3xl font-bold text-gray-900 font-playfair tracking-tight leading-tight">Emergency contact information</h3>
        <p className="text-sm sm:text-lg text-gray-400 font-regular leading-relaxed font-dm text-balance">In case of an emergency, we'll contact this person on {isFamilyMember ? "their" : "your"} behalf. Please provide accurate information.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Contact's full name</label>
          <input
            type="text"
            placeholder="Enter contact's full name"
            value={formData.emergencyName}
            onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
            className="mt-2 w-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium placeholder:text-gray-400 text-sm sm:text-base shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Relationship to {isFamilyMember ? "them" : "you"}</label>
          <div className="relative">
            <select
              value={formData.emergencyRelation}
              onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
              className="mt-2 w-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium appearance-none text-sm sm:text-base cursor-pointer shadow-sm"
            >
              <option value="Daughter">Daughter</option>
              <option value="Son">Son</option>
              <option value="Spouse">Spouse</option>
              <option value="Sibling">Sibling</option>
              <option value="Friend">Friend</option>
              <option value="Other">Other</option>
            </select>
            <HiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Phone number</label>
          <div className="mt-2 flex gap-4 relative">
            <div className="relative shrink-0" ref={emergencyCountryRef}>
              <div
                onClick={() => setIsEmergencyCountryOpen(!isEmergencyCountryOpen)}
                className="w-24 sm:w-32 h-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl flex items-center justify-between px-4 sm:px-5 cursor-pointer hover:border-primary/30 duration-300"
              >
                <span className="text-sm sm:text-base">{CountriesData.find(c => c.code === formData.emergencyCountryCode)?.flag || '🇨🇦'} {formData.emergencyCountryCode}</span>
                <HiChevronDown className={`text-gray-400 duration-300 ${isEmergencyCountryOpen ? 'rotate-180' : ''}`} />
              </div>

              {isEmergencyCountryOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-logs overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 py-2">
                  {CountriesData.map((country) => (
                    <button
                      key={country.name}
                      onClick={() => {
                        setFormData({ ...formData, emergencyCountryCode: country.code });
                        setIsEmergencyCountryOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 duration-200"
                    >
                      <span>{country.flag}</span>
                      <span className="text-sm font-medium text-gray-700">{country.name}</span>
                      <span className="text-sm text-gray-400 ml-auto">{country.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="tel"
              placeholder="123-456-7890"
              value={formData.emergencyPhone}
              onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
              className="w-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium placeholder:text-gray-400 text-sm sm:text-base shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Email address</label>
          <input
            type="email"
            placeholder="contact@example.com"
            value={formData.emergencyEmail}
            onChange={(e) => setFormData({ ...formData, emergencyEmail: e.target.value })}
            className="mt-2 w-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium placeholder:text-gray-400 text-sm sm:text-base shadow-sm"
          />
        </div>
      </div>

      <div
        onClick={() => {
          if (formData.emergencyName && formData.emergencyPhone) {
            setFormData({
              ...formData,
              emergencyContacts: [...formData.emergencyContacts, {
                name: formData.emergencyName,
                relation: formData.emergencyRelation,
                phone: formData.emergencyPhone,
                countryCode: formData.emergencyCountryCode,
                email: formData.emergencyEmail
              }],
              emergencyName: '',
              emergencyRelation: 'Daughter',
              emergencyPhone: '',
              emergencyEmail: '',
            });
          }
        }}
        className={clsx(
          "pt-6 border-t border-gray-100/80 flex items-center justify-between group duration-300",
          (!formData.emergencyName || !formData.emergencyPhone) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
      >
        <span className="text-base sm:text-lg font-bold text-gray-900 font-dm group-hover:text-primary duration-300">
          {formData.emergencyContacts.length > 0 ? "Add another emergency contact" : "Save and add a second contact"}
        </span>
        <div className="size-10 sm:size-12 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-white duration-300 text-primary shrink-0 active:scale-95">
          <HiPlus className="size-5 sm:size-6" />
        </div>
      </div>

      {formData.emergencyContacts.length > 0 && formData.emergencyContacts.map((contact: IEmergencyContact, index: number) => (
        <div key={index} className="border border-green-200/50 rounded-2xl md:rounded-6xl p-6 sm:p-8 flex flex-col gap-5 bg-green-50/30 shadow-sm hover:shadow-md duration-300 relative group animate-in slide-in-from-bottom-4">
          <button
            onClick={() => {
              const newContacts = [...formData.emergencyContacts];
              newContacts.splice(index, 1);
              setFormData({ ...formData, emergencyContacts: newContacts });
            }}
            className="absolute top-6 sm:top-8 right-6 sm:right-8 text-gray-400 hover:text-red-500 duration-300 opacity-0 group-hover:opacity-100 font-bold text-xs sm:text-sm font-dm underline cursor-pointer"
          >
            Remove
          </button>
          <div className="flex items-center gap-2">
            <div className="size-2 bg-green-500 rounded-full flex-shrink-0 animate-pulse"></div>
            <span className="text-xs sm:text-[13px] font-bold text-green-600 uppercase tracking-widest font-dm">Emergency contact saved</span>
          </div>
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="size-14 sm:size-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl sm:text-2xl font-playfair shadow-sm shrink-0 uppercase">
              {contact.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="space-y-1 sm:space-y-1.5">
              <h5 className="text-lg sm:text-xl font-bold text-gray-900 font-dm">{contact.name}</h5>
              <p className="text-sm sm:text-[15px] text-gray-500 font-medium font-dm">{contact.relation} · {contact.countryCode} {contact.phone}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmergencyContact;
