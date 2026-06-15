import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardSidebar from '../components/dashboard/dashboardSidebar/dashboardSidebar';
import DashboardHeader from '../components/dashboard/dashboardHeader/dashboardHeader';
import SettingsHeader from '../components/dashboard/settings/settingsHeader/settingsHeader';
import SwitchAccountsPanel from '../components/settings/SwitchAccountsPanel';
import { getDashboardPathForRole } from '../utils/linkedAccounts';

const SwitchAccountsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full bg-surface-alt font-dm overflow-hidden">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-8 lg:p-12 pb-24">
            <SettingsHeader
              title="Switch Accounts"
              description="Manage multiple profiles and switch between them seamlessly."
              breadcrumbs={[
                { label: 'Settings', to: '/settings' },
                { label: 'Switch Accounts' },
              ]}
              backTo="/settings"
            />

            <SwitchAccountsPanel
              onAfterSwitch={(role) => navigate(getDashboardPathForRole(role), { replace: true })}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SwitchAccountsPage;
