import React from 'react';
import { HiOutlineKey, HiOutlineShieldCheck, HiChevronRight } from 'react-icons/hi';
import { clsx } from 'clsx';

interface SecurityNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isTwoFactorEnabled: boolean;
  saveLoginInfo: boolean;
  setSaveLoginInfo: (val: boolean) => void;
}

const SecurityNav: React.FC<SecurityNavProps> = ({
  activeTab,
  setActiveTab,
  isTwoFactorEnabled,
  saveLoginInfo,
  setSaveLoginInfo
}) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-fit animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="p-6 sm:p-8 border-b border-gray-50">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-playfair">Password & Security</h3>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <p className="text-sm sm:text-base text-text-muted font-medium font-dm leading-relaxed">
          Manage your passwords, login preferences and recovery methods.
        </p>

        <div className="space-y-2">
          {/* Change Password Tab */}
          <button
            onClick={() => setActiveTab('password')}
            className={clsx(
              "w-full flex items-center justify-between p-3 sm:p-4 rounded-xl duration-300 group",
              activeTab === 'password' ? "bg-primary-extralight text-primary" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <HiOutlineKey className="size-5 sm:size-6" />
              <span className="font-bold font-dm text-sm sm:text-base">Change password</span>
            </div>
            <HiChevronRight className={clsx("size-4 sm:size-5 duration-300", activeTab === 'password' ? "translate-x-0" : "opacity-0 -translate-x-2")} />
          </button>

          {/* 2FA Tab */}
          <button
            onClick={() => setActiveTab('2fa')}
            className={clsx(
              "w-full flex items-center justify-between p-3 sm:p-4 rounded-xl duration-300 group",
              activeTab === '2fa' ? "bg-primary-extralight text-primary" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <HiOutlineShieldCheck className="size-5 sm:size-6" />
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="font-bold font-dm text-sm sm:text-base">Two-factor authentication</span>
                {isTwoFactorEnabled && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-md leading-none">
                    Enabled
                  </span>
                )}
              </div>
            </div>
            <HiChevronRight className={clsx("size-4 sm:size-5 duration-300", activeTab === '2fa' ? "translate-x-0" : "opacity-0 -translate-x-2")} />
          </button>
        </div>

        <div className="pt-6 border-t border-gray-50 flex items-center justify-between gap-4">
          <span className="font-bold text-gray-900 font-dm text-sm sm:text-base">Save login information</span>
          <button
            onClick={() => setSaveLoginInfo(!saveLoginInfo)}
            className={clsx(
              "w-12 h-6 sm:w-14 sm:h-7 rounded-full relative duration-300 shrink-0",
              saveLoginInfo ? "bg-primary" : "bg-gray-200"
            )}
          >
            <div className={clsx(
              "absolute top-1 size-4 sm:size-5 bg-white rounded-full duration-300 shadow-sm",
              saveLoginInfo ? "left-7 sm:left-8" : "left-1"
            )} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityNav;
