import React, { useState, useEffect, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import { HiChevronDown, HiCheck, HiDeviceMobile, HiMail } from 'react-icons/hi';
import type { ProfileFormData } from '../../../types/profile';
const CountriesData = [
  { code: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
];

interface ContactInfoProps {
  formData: ProfileFormData;
  setFormData: Dispatch<SetStateAction<ProfileFormData>>;
  isFamilyMember?: boolean;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ formData, setFormData, isFamilyMember }) => {
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h3 className="text-xl sm:text-3xl font-bold text-gray-900 font-playfair tracking-tight leading-tight">{isFamilyMember ? "How can we reach them?" : "How can we reach you?"}</h3>
        <p className="text-sm sm:text-lg text-gray-400 font-medium leading-relaxed font-dm text-balance">We'll use this to send appointment confirmations and important updates.</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Phone number</label>
          <div className="mt-2 flex gap-4 relative">
            <div className="relative shrink-0" ref={countryRef}>
              <div
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="w-24 sm:w-32 h-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl flex items-center justify-between px-4 sm:px-5 cursor-pointer hover:border-primary/20 duration-300"
              >
                <span className="text-sm sm:text-base">{CountriesData.find(c => c.code === formData.countryCode)?.flag || '🇨🇦'} {formData.countryCode}</span>
                <HiChevronDown className="text-gray-400" />
              </div>
              {isCountryDropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full sm:w-56 bg-white rounded-xl shadow-logs border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {CountriesData.map((c, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setFormData({ ...formData, countryCode: c.code, countryFlag: c.flag });
                        setIsCountryDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 p-3.5 cursor-pointer hover:bg-primary/5 duration-200 text-sm sm:text-base text-gray-600"
                    >
                      <span className="text-lg">{c.flag}</span>
                      <span className="font-bold">{c.code}</span>
                      <span className="text-xs text-gray-400 ml-auto truncate">{c.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              type="tel"
              placeholder="123-456-7890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="flex-1 bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium placeholder:text-gray-300 text-sm sm:text-base shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 text-green-600 bg-green-50 w-fit px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold font-dm ml-1">
            <HiCheck className="size-4" />
            Verified via SMS
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Email address</label>
          <input
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-2 w-full bg-white border-2 border-primary/10 rounded-xl md:rounded-2xl p-4 sm:p-5 outline-none focus:border-primary duration-300 text-gray-900 font-medium placeholder:text-gray-300 text-sm sm:text-base shadow-sm"
          />
          <p className="text-xs text-gray-400 font-medium ml-1 font-dm">A verification link will be sent to this address</p>
        </div>

        <div className="pt-6 space-y-8">
          <h4 className="text-base sm:text-lg font-bold text-gray-900 font-playfair capitalize tracking-wide">Notification preferences</h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between py-4 group">
              <div className="flex items-center gap-4">
                <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <HiDeviceMobile className="size-6" />
                </div>
                <span className="text-base font-bold text-gray-800 font-dm">SMS appointment reminders</span>
              </div>
              <button
                onClick={() => setFormData({ ...formData, smsNotifications: !formData.smsNotifications })}
                className={clsx(
                  'w-14 h-7 rounded-full relative duration-300',
                  formData.smsNotifications ? 'bg-primary' : 'bg-gray-200'
                )}
              >
                <div className={clsx(
                  'size-6 bg-white rounded-full absolute top-0.5 duration-300 shadow-sm',
                  formData.smsNotifications ? 'left-7' : 'left-0.5'
                )} />
              </button>
            </div>

            <div className="h-px w-full bg-gray-100" />

            <div className="flex items-center justify-between py-4 group">
              <div className="flex items-center gap-4">
                <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <HiMail className="size-6" />
                </div>
                <span className="text-base font-bold text-gray-800 font-dm">Email updates and news</span>
              </div>
              <button
                onClick={() => setFormData({ ...formData, emailNotifications: !formData.emailNotifications })}
                className={clsx(
                  'w-14 h-7 rounded-full relative duration-300',
                  formData.emailNotifications ? 'bg-primary' : 'bg-gray-200'
                )}
              >
                <div className={clsx(
                  'size-6 bg-white rounded-full absolute top-0.5 duration-300 shadow-sm',
                  formData.emailNotifications ? 'left-7' : 'left-0.5'
                )} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
