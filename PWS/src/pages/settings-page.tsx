import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import {
  HiOutlineSearch,
  HiOutlineSwitchHorizontal,
  HiOutlineUserCircle,
  HiOutlineBell,
  HiOutlineCreditCard,
  HiOutlineAdjustments,
  HiOutlineLockClosed,
  HiOutlineDatabase,
  HiOutlineInformationCircle,
  HiOutlineExclamation
} from 'react-icons/hi';

import DashboardSidebar from '../components/dashboard/dashboardSidebar/dashboardSidebar';
import DashboardHeader from '../components/dashboard/dashboardHeader/dashboardHeader';
import SettingsHeader from '../components/dashboard/settings/settingsHeader/settingsHeader';
import SettingSection from '../components/dashboard/settings/settingSection/settingSection';
import SettingItem from '../components/dashboard/settings/settingItem/settingItem';
import { useUser } from '../context/UserContext';

const SETTINGS_DATA = [
  {
    title: "Account",
    items: [
      { id: 'switch', icon: HiOutlineSwitchHorizontal, label: "Switch Accounts" },
      { id: 'profile', icon: HiOutlineUserCircle, label: "Profile Settings" },
      { id: 'notifications', icon: HiOutlineBell, label: "Notification Settings" },
      { id: 'billing', icon: HiOutlineCreditCard, label: "Billing & Payment" },
      { id: 'preferences', icon: HiOutlineAdjustments, label: "Preferences" },
    ]
  },
  {
    title: "Security & App",
    items: [
      { id: 'security', icon: HiOutlineLockClosed, label: "Password & Security" },
      { id: 'data', icon: HiOutlineDatabase, label: "Data" },
    ]
  },
  {
    title: "Info",
    items: [
      { id: 'about', icon: HiOutlineInformationCircle, label: "About" },
    ]
  }
];

const SettingsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { clearUser } = useUser();

  const handleItemClick = (id: string) => {
    if (id === 'switch') {
      navigate('/settings/switch-accounts');
    } else if (id === 'profile') {
      navigate('/settings/profile');
    } else if (id === 'notifications') {
      navigate('/settings/notifications');
    } else if (id === 'billing') {
      navigate('/settings/billing');
    } else if (id === 'preferences') {
      navigate('/settings/preferences');
    } else if (id === 'security') {
      navigate('/settings/security');
    } else if (id === 'data') {
      navigate('/settings/data');
    } else if (id === 'about') {
      navigate('/settings/about');
    }
  };

  const filteredSettings = SETTINGS_DATA.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="flex h-screen w-full bg-surface-alt font-dm overflow-hidden">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-8 lg:p-12 pb-24">


            <SettingsHeader
              title="Settings"
              description="Manage your account and preferences"
            />


            <div className="relative group mb-8 lg:mb-12">
              <HiOutlineSearch className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 size-5 sm:size-7 text-gray-400 group-focus-within:text-primary duration-300" />
              <input
                type="text"
                placeholder="Type to search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-xl sm:rounded-2xl py-4 sm:py-5 lg:py-6 pl-12 sm:pl-16 pr-6 text-sm sm:text-base lg:text-lg font-medium font-dm shadow-lg shadow-black/[0.02] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 duration-300"
              />
            </div>


            <div className="space-y-6 sm:space-y-8">
              {filteredSettings.length > 0 ? (
                filteredSettings.map((section, idx) => (
                  <SettingSection key={idx} title={section.title}>
                    {section.items.map((item, itemIdx) => (
                      <SettingItem
                        key={itemIdx}
                        icon={item.icon}
                        label={item.label}
                        showBorder={itemIdx !== section.items.length - 1}
                        onClick={() => handleItemClick(item.id)}
                      />
                    ))}
                  </SettingSection>
                ))
              ) : (
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-12 sm:p-20 text-center shadow-sm">
                  <div className="size-16 sm:size-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4 sm:mb-6">
                    <HiOutlineExclamation className="size-8 sm:size-10" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No settings found</h3>
                  <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed">We couldn't find any results for "{searchQuery}"</p>
                </div>
              )}
            </div>


            <div className="mt-8">
              <button
                onClick={() => {
                  clearUser();
                  navigate('/login');
                }}
                className="w-full bg-white border border-gray-100 rounded-xl sm:rounded-2xl py-4 sm:py-5 lg:py-6 text-sm sm:text-base lg:text-lg font-bold text-red-500 hover:bg-red-50 hover:border-red-100 duration-300 shadow-sm active:scale-[0.98]"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
