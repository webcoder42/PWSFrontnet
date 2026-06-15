import React, { useState, useEffect, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import { HiChevronDown } from 'react-icons/hi';
import type { ProviderProfileFormData } from '../../../types/profile';

const CountriesData = [
  { code: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
];

interface ProviderContactInfoProps {
  formData: ProviderProfileFormData;
  setFormData: Dispatch<SetStateAction<ProviderProfileFormData>>;
}

const ProviderContactInfo: React.FC<ProviderContactInfoProps> = ({ formData, setFormData }) => {
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isAltCountryDropdownOpen, setIsAltCountryDropdownOpen] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);
  const altCountryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (altCountryRef.current && !altCountryRef.current.contains(event.target as Node)) {
        setIsAltCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNotification = (key: 'smsAlerts' | 'emailAlerts' | 'messageAlerts') => {
    setFormData({ ...formData, [key]: !formData[key] });
  };

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl md:text-[28px] font-bold text-gray-900 font-playfair tracking-tight leading-tight">Your contact details</h3>
        <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed font-dm">We'll use these to send appointment notifications, booking requests, and payment updates.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] sm:text-[13px] font-bold text-gray-900 font-dm">Phone number</label>
          <div className="flex gap-3 relative">
            <div className="relative shrink-0" ref={countryRef}>
              <div 
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl md:rounded-2xl px-3 sm:px-4 py-3 sm:py-4 cursor-pointer hover:border-primary/20 duration-300 shadow-sm"
              >
                <span className="text-base sm:text-lg">{formData.countryFlag}</span>
                <span className="text-sm sm:text-base font-medium font-dm text-gray-900">{formData.countryCode}</span>
                <HiChevronDown className="size-4 sm:size-5 text-gray-400" />
              </div>
              {isCountryDropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-48 sm:w-56 bg-white rounded-xl shadow-logs border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {CountriesData.map((c, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setFormData({ ...formData, countryCode: c.code, countryFlag: c.flag });
                        setIsCountryDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-primary/5 duration-200 text-sm sm:text-base text-gray-600"
                    >
                      <span className="text-base sm:text-lg">{c.flag}</span>
                      <span className="font-bold">{c.code}</span>
                      <span className="text-[11px] sm:text-xs text-gray-400 ml-auto truncate">{c.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              type="tel"
              placeholder="123-456-7890"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full flex-1 bg-white border border-primary/40 rounded-xl md:rounded-2xl p-3 sm:p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary duration-300 text-gray-900 font-medium placeholder:text-gray-400 text-sm sm:text-base font-dm shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] sm:text-[13px] font-bold text-gray-900 font-dm">Email address</label>
          <input
            type="email"
            placeholder="yourname@email.com"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-white border border-gray-200 rounded-xl md:rounded-2xl p-3 sm:p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary duration-300 text-gray-900 font-medium placeholder:text-gray-400 text-sm sm:text-base font-dm shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] sm:text-[13px] font-bold text-gray-900 font-dm">Alternate contact name (optional)</label>
          <input
            type="text"
            placeholder="Full name"
            value={formData.altContactName || ''}
            onChange={(e) => setFormData({ ...formData, altContactName: e.target.value })}
            className="w-full bg-white border border-gray-200 rounded-xl md:rounded-2xl p-3 sm:p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary duration-300 text-gray-900 font-medium placeholder:text-gray-400 text-sm sm:text-base font-dm shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] sm:text-[13px] font-bold text-gray-900 font-dm">Alternate contact phone (optional)</label>
          <div className="flex gap-3 relative">
            <div className="relative shrink-0" ref={altCountryRef}>
              <div 
                onClick={() => setIsAltCountryDropdownOpen(!isAltCountryDropdownOpen)}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl md:rounded-2xl px-3 sm:px-4 py-3 sm:py-4 cursor-pointer hover:border-primary/20 duration-300 shadow-sm"
              >
                <span className="text-base sm:text-lg">{formData.altCountryFlag}</span>
                <span className="text-sm sm:text-base font-medium font-dm text-gray-900">{formData.altCountryCode}</span>
                <HiChevronDown className="size-4 sm:size-5 text-gray-400" />
              </div>
              {isAltCountryDropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-48 sm:w-56 bg-white rounded-xl shadow-logs border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {CountriesData.map((c, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setFormData({ ...formData, altCountryCode: c.code, altCountryFlag: c.flag });
                        setIsAltCountryDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-primary/5 duration-200 text-sm sm:text-base text-gray-600"
                    >
                      <span className="text-base sm:text-lg">{c.flag}</span>
                      <span className="font-bold">{c.code}</span>
                      <span className="text-[11px] sm:text-xs text-gray-400 ml-auto truncate">{c.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              type="tel"
              placeholder="(416) 000-0000"
              value={formData.altContactPhone || ''}
              onChange={(e) => setFormData({ ...formData, altContactPhone: e.target.value })}
              className="w-full flex-1 bg-white border border-gray-200 rounded-xl md:rounded-2xl p-3 sm:p-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary duration-300 text-gray-900 font-medium placeholder:text-gray-400 text-sm sm:text-base font-dm shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-[11px] sm:text-[13px] font-bold text-gray-900 font-dm block">Notifications</label>
        
        <div className="border border-gray-200 rounded-xl md:rounded-2xl overflow-hidden mt-3 shadow-sm bg-white">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
            <span className="font-medium text-sm sm:text-base text-gray-900 font-dm">SMS appointment alerts</span>
            <button 
              onClick={() => toggleNotification('smsAlerts')}
              className={clsx(
                "w-12 sm:w-14 h-6 sm:h-7 rounded-full relative duration-300 outline-none",
                formData.smsAlerts ? "bg-primary" : "bg-gray-200"
              )}
            >
              <div className={clsx(
                "absolute top-1/2 -translate-y-1/2 size-4 sm:size-5 bg-white rounded-full duration-300 shadow-sm",
                formData.smsAlerts ? "left-[calc(100%-22px)] sm:left-[calc(100%-24px)]" : "left-1"
              )} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
            <span className="font-medium text-sm sm:text-base text-gray-900 font-dm">Email booking confirmations</span>
            <button 
              onClick={() => toggleNotification('emailAlerts')}
              className={clsx(
                "w-12 sm:w-14 h-6 sm:h-7 rounded-full relative duration-300 outline-none",
                formData.emailAlerts ? "bg-primary" : "bg-gray-200"
              )}
            >
              <div className={clsx(
                "absolute top-1/2 -translate-y-1/2 size-4 sm:size-5 bg-white rounded-full duration-300 shadow-sm",
                formData.emailAlerts ? "left-[calc(100%-22px)] sm:left-[calc(100%-24px)]" : "left-1"
              )} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 sm:p-5">
            <span className="font-medium text-sm sm:text-base text-gray-900 font-dm">New client message alerts</span>
            <button 
              onClick={() => toggleNotification('messageAlerts')}
              className={clsx(
                "w-12 sm:w-14 h-6 sm:h-7 rounded-full relative duration-300 outline-none",
                formData.messageAlerts ? "bg-primary" : "bg-gray-200"
              )}
            >
              <div className={clsx(
                "absolute top-1/2 -translate-y-1/2 size-4 sm:size-5 bg-white rounded-full duration-300 shadow-sm",
                formData.messageAlerts ? "left-[calc(100%-22px)] sm:left-[calc(100%-24px)]" : "left-1"
              )} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderContactInfo;
