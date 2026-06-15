import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import DashboardSidebar from '../components/dashboard/dashboardSidebar/dashboardSidebar';
import DashboardHeader from '../components/dashboard/dashboardHeader/dashboardHeader';
import SettingsHeader from '../components/dashboard/settings/settingsHeader/settingsHeader';
import SecurityNav from '../components/security/securityNav/securityNav';
import ChangePasswordSection from '../components/security/changePasswordSection/changePasswordSection';
import TwoFactorSection from '../components/security/twoFactorSection/twoFactorSection';

const PasswordSecurityPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('password');
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(true);
  const [saveLoginInfo, setSaveLoginInfo] = useState(true);

  return (
    <div className="flex min-h-screen w-full bg-surface-alt font-dm overflow-hidden">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-8 lg:p-12 pb-24">


            <SettingsHeader
              title="Password & Security"
              description="Manage your account security, authentication methods, and active sessions."
              breadcrumbs={[
                { label: 'Settings', to: '/settings' },
                { label: 'Password & Security' }
              ]}
              backTo="/settings"
            />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">

              <div className="xl:col-span-4">
                <SecurityNav
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  isTwoFactorEnabled={isTwoFactorEnabled}
                  saveLoginInfo={saveLoginInfo}
                  setSaveLoginInfo={setSaveLoginInfo}
                />
              </div>


              <div className="xl:col-span-8">
                {activeTab === 'password' && <ChangePasswordSection />}
                {activeTab === '2fa' && (
                  <TwoFactorSection onComplete={() => setIsTwoFactorEnabled(true)} />
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default PasswordSecurityPage;
