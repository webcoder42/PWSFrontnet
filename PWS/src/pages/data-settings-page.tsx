import { useState } from 'react';
import { clsx } from 'clsx';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

import DashboardSidebar from '../components/dashboard/dashboardSidebar/dashboardSidebar';
import DashboardHeader from '../components/dashboard/dashboardHeader/dashboardHeader';
import SettingsHeader from '../components/dashboard/settings/settingsHeader/settingsHeader';

const DataSettingsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 5000);
    }, 2000);
  };

  return (
    <div className="flex h-screen w-full bg-surface-alt font-dm overflow-hidden">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-8 lg:p-12 pb-24">


            <SettingsHeader
              title="Data"
              description="Manage your practice records and compliance data."
              breadcrumbs={[
                { label: 'Settings', to: '/settings' },
                { label: 'Data' }
              ]}
              backTo="/settings"
            />

            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 mb-8 sm:mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-dm leading-snug">Practice & Compliance Data Download</h3>
                  <p className="text-sm sm:text-base text-text-muted font-medium font-dm leading-relaxed">
                    We'll send your practice records and compliance data on file to <span className="text-gray-900 font-bold break-all sm:break-normal">jackhudson@gmail.com</span>
                  </p>
                </div>

                <div className="size-8 rounded-full border-2 border-primary flex items-center justify-center shrink-0 self-end sm:self-center">
                  <div className="size-4 bg-primary rounded-full animate-in zoom-in duration-300" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start lg:items-center gap-6">
              <button
                onClick={handleSend}
                disabled={isSending}
                className={clsx(
                  "w-full sm:max-w-md py-4 sm:py-5 bg-gradient-purple text-white font-bold text-lg sm:text-xl rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.01] duration-300 active:scale-95 flex items-center justify-center gap-3",
                  isSending && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSending && <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {isSending ? 'Sending...' : isSent ? 'Sent Successfully!' : 'Send'}
              </button>

              <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 font-medium font-dm text-center sm:text-left lg:text-center leading-relaxed">
                Your data is encrypted and handled in compliance with HIPAA and GDPR standards for care providers.
              </p>
            </div>

            {isSent && (
              <div className="mt-8 sm:mt-10 bg-emerald-50 border border-emerald-100 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-in zoom-in duration-300">
                <HiOutlineCheckCircle className="size-8 text-emerald-500 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-emerald-900 font-bold font-dm text-base sm:text-lg">Request Processed</h4>
                  <p className="text-emerald-700 text-xs sm:text-sm font-medium font-dm leading-relaxed">
                    Please check your email. Your data file should arrive within a few minutes.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default DataSettingsPage;
