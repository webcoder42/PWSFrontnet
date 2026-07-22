import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { clsx } from 'clsx';
import { HiDeviceMobile, HiMail } from 'react-icons/hi';
import type { ProfileFormData } from '../../../types/profile';
import PhoneInput from '../../PhoneInput';
import PhoneVerification from '../../PhoneVerification';

interface ContactInfoProps {
  formData: ProfileFormData;
  setFormData: Dispatch<SetStateAction<ProfileFormData>>;
  isFamilyMember?: boolean;
  onPhoneVerifiedChange?: (verified: boolean) => void;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ formData, setFormData, isFamilyMember, onPhoneVerifiedChange }) => {

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h3 className="text-xl sm:text-3xl font-bold text-gray-900 font-playfair tracking-tight leading-tight">{isFamilyMember ? "How can we reach them?" : "How can we reach you?"}</h3>
        <p className="text-sm sm:text-lg text-gray-400 font-medium leading-relaxed font-dm text-balance">We'll use this to send appointment confirmations and important updates.</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <label className="text-xs sm:text-sm font-dm font-bold text-gray-900 uppercase tracking-widest ml-1 opacity-60">Phone number</label>
          <div className="mt-2">
            <PhoneInput
              value={formData.phone}
              onChange={(phone) => {
                setFormData({ ...formData, phone });
                onPhoneVerifiedChange?.(false);
              }}
              countryCode={formData.countryCode}
              onCountryCodeChange={(code) => {
                setFormData({ ...formData, countryCode: code });
                onPhoneVerifiedChange?.(false);
              }}
            />
          </div>
          <div className="ml-1">
            <PhoneVerification
              phone={formData.phone}
              countryCode={formData.countryCode}
              onVerified={onPhoneVerifiedChange || (() => {})}
            />
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
