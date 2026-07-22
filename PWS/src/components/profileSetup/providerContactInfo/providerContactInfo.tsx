import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import type { ProviderProfileFormData } from '../../../types/profile';
import PhoneInput from '../../PhoneInput';
import PhoneVerification from '../../PhoneVerification';

interface ProviderContactInfoProps {
  formData: ProviderProfileFormData;
  setFormData: Dispatch<SetStateAction<ProviderProfileFormData>>;
  onPhoneVerifiedChange?: (verified: boolean) => void;
}

const ProviderContactInfo: React.FC<ProviderContactInfoProps> = ({ formData, setFormData, onPhoneVerifiedChange }) => {
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
          <PhoneInput
            value={formData.phone || ''}
            onChange={(phone) => {
              setFormData({ ...formData, phone });
              onPhoneVerifiedChange?.(false);
            }}
            countryCode={formData.countryCode}
            onCountryCodeChange={(code) => {
              setFormData({ ...formData, countryCode: code });
              onPhoneVerifiedChange?.(false);
            }}
            placeholder="123-456-7890"
          />
          <PhoneVerification
            phone={formData.phone || ''}
            countryCode={formData.countryCode}
            onVerified={onPhoneVerifiedChange || (() => {})}
          />
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
          <PhoneInput
            value={formData.altContactPhone || ''}
            onChange={(phone) => setFormData({ ...formData, altContactPhone: phone })}
            countryCode={formData.altCountryCode}
            onCountryCodeChange={(code) => setFormData({ ...formData, altCountryCode: code })}
            placeholder="(416) 000-0000"
          />
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
