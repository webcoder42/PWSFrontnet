import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiCheckCircle,
} from 'react-icons/hi';
import { clsx } from 'clsx';
import { useUser } from '../context/UserContext';
import { updateUserProfileAPI } from '../utils/api';

import DashboardSidebar from '../components/dashboard/dashboardSidebar/dashboardSidebar';
import DashboardHeader from '../components/dashboard/dashboardHeader/dashboardHeader';
import SettingsHeader from '../components/dashboard/settings/settingsHeader/settingsHeader';

interface NotificationItemProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
  required?: boolean;
  showBorder?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  description,
  enabled,
  onToggle,
  disabled = false,
  required = false,
  showBorder = true
}) => {
  return (
    <div
      onClick={() => !disabled && onToggle()}
      className={clsx(
        "p-5 sm:p-8 flex items-center justify-between gap-4 sm:gap-6 group duration-300",
        showBorder && "border-b border-gray-50",
        !disabled ? "cursor-pointer hover:bg-gray-50/80" : "bg-white"
      )}
    >
      <div className="flex-1 min-w-0">
        <h4 className={clsx(
          "text-sm sm:text-lg lg:text-xl font-bold font-dm mb-1 sm:mb-1.5 duration-300 truncate sm:whitespace-normal",
          disabled ? "text-gray-400" : "text-gray-900 group-hover:text-primary"
        )}>
          {title}
        </h4>
        <div className="text-[11px] sm:text-base text-gray-400 font-medium font-dm leading-relaxed">
          {required && (
            <span className="text-red-400 font-extrabold uppercase text-[9px] sm:text-[11px] block mb-1.5 sm:mb-2 tracking-wider">
              REQUIRED. CANNOT BE DISABLED.
            </span>
          )}
          <p className="line-clamp-2 sm:line-clamp-none">{description}</p>
        </div>
      </div>

      <div className="flex items-center shrink-0">
        <button
          type="button"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={clsx(
            "relative inline-flex items-center h-6 w-11 sm:h-7 sm:w-14 cursor-pointer rounded-full duration-300 focus:outline-none px-1",
            enabled ? "bg-primary shadow-lg shadow-primary/20" : "bg-gray-200",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span
            className={clsx(
              "pointer-events-none inline-block size-4 sm:size-5 transform rounded-full bg-white shadow-md transition duration-300",
              enabled ? "translate-x-5 sm:translate-x-7" : "translate-x-0"
            )}
          />
        </button>
      </div>
    </div>
  );
};

const NotificationSettingsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { rawUser, setUser } = useUser();

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('notification_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fall back to defaults if parsing fails
      }
    }

    return {
      appointmentReminders: true,
      visitConfirmations: true,
      cancellationAlerts: true,
      newMessages: true,
      readReceipts: false,
      profileUpdates: true,
      paymentNotifications: true,
      securityAlerts: true, // Required
      tipsUpdates: false,
      specialOffers: false
    };
  });

  useEffect(() => {
    localStorage.setItem('notification_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (rawUser?.notificationPreferences && typeof rawUser.notificationPreferences === 'object') {
      const prefs = rawUser.notificationPreferences as Record<string, unknown>;
      setSettings({
        appointmentReminders: typeof prefs.appointmentReminders === 'boolean' ? prefs.appointmentReminders : true,
        visitConfirmations: typeof prefs.visitConfirmations === 'boolean' ? prefs.visitConfirmations : true,
        cancellationAlerts: typeof prefs.cancellationAlerts === 'boolean' ? prefs.cancellationAlerts : true,
        newMessages: typeof prefs.newMessages === 'boolean' ? prefs.newMessages : true,
        readReceipts: typeof prefs.readReceipts === 'boolean' ? prefs.readReceipts : false,
        profileUpdates: typeof prefs.profileUpdates === 'boolean' ? prefs.profileUpdates : true,
        paymentNotifications: typeof prefs.paymentNotifications === 'boolean' ? prefs.paymentNotifications : true,
        securityAlerts: typeof prefs.securityAlerts === 'boolean' ? prefs.securityAlerts : true,
        tipsUpdates: typeof prefs.tipsUpdates === 'boolean' ? prefs.tipsUpdates : false,
        specialOffers: typeof prefs.specialOffers === 'boolean' ? prefs.specialOffers : false
      });
    }
  }, [rawUser]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    const userId = (rawUser?._id || rawUser?.id || '') as string;
    if (!userId) {
      alert('User session missing. Please login again.');
      return;
    }

    try {
      setIsSaving(true);
      const response = await updateUserProfileAPI(userId, {
        notificationPreferences: settings
      });

      if (response?.data) {
        setUser(response.data);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Could not save notification preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-surface-alt font-dm overflow-hidden">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-8 lg:p-12 pb-24">


            <SettingsHeader
              title="Notification Settings"
              description="Configure how and when you want to receive alerts and updates."
              breadcrumbs={[
                { label: 'Settings', to: '/settings' },
                { label: 'Notifications' }
              ]}
              backTo="/settings"
            />

            <div className="space-y-10 sm:space-y-12 lg:space-y-16">


              <section>
                <h3 className="text-[11px] sm:text-[14px] font-bold text-gray-400 uppercase tracking-[0.25em] mb-4 sm:mb-6 ml-1">Appointments</h3>
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <NotificationItem
                    title="Appointment Reminders"
                    description="Get notified of upcoming shifts and care visits."
                    enabled={settings.appointmentReminders}
                    onToggle={() => toggleSetting('appointmentReminders')}
                  />
                  <NotificationItem
                    title="Visit Confirmations"
                    description="Receive alerts when a caregiver confirms a visit."
                    enabled={settings.visitConfirmations}
                    onToggle={() => toggleSetting('visitConfirmations')}
                  />
                  <NotificationItem
                    title="Cancellation Alerts"
                    description="Immediate notifications for schedule changes or cancellations."
                    enabled={settings.cancellationAlerts}
                    onToggle={() => toggleSetting('cancellationAlerts')}
                    showBorder={false}
                  />
                </div>
              </section>


              <section>
                <h3 className="text-[11px] sm:text-[14px] font-bold text-gray-400 uppercase tracking-[0.25em] mb-4 sm:mb-6 ml-1">Messages</h3>
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <NotificationItem
                    title="New Messages"
                    description="Get notified when you receive a message from a client or PSW."
                    enabled={settings.newMessages}
                    onToggle={() => toggleSetting('newMessages')}
                  />
                  <NotificationItem
                    title="Message Read Receipts"
                    description="Show others when you've read their messages."
                    enabled={settings.readReceipts}
                    onToggle={() => toggleSetting('readReceipts')}
                    showBorder={false}
                  />
                </div>
              </section>


              <section>
                <h3 className="text-[11px] sm:text-[14px] font-bold text-gray-400 uppercase tracking-[0.25em] mb-4 sm:mb-6 ml-1">Account & Security</h3>
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <NotificationItem
                    title="Profile Updates"
                    description="Confirmations when changes are made to your account details."
                    enabled={settings.profileUpdates}
                    onToggle={() => toggleSetting('profileUpdates')}
                  />
                  <NotificationItem
                    title="Payment Notifications"
                    description="Receipts and billing updates for completed care sessions."
                    enabled={settings.paymentNotifications}
                    onToggle={() => toggleSetting('paymentNotifications')}
                  />
                  <NotificationItem
                    title="Security Alerts"
                    description="Alerts for unrecognized logins or password changes."
                    enabled={settings.securityAlerts}
                    onToggle={() => { }}
                    disabled={true}
                    required={true}
                    showBorder={false}
                  />
                </div>
              </section>


              <section>
                <h3 className="text-[11px] sm:text-[14px] font-bold text-gray-400 uppercase tracking-[0.25em] mb-4 sm:mb-6 ml-1">Marketing</h3>
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <NotificationItem
                    title="Tips & Platform Updates"
                    description="Helpful advice on home care and news about the curator platform."
                    enabled={settings.tipsUpdates}
                    onToggle={() => toggleSetting('tipsUpdates')}
                  />
                  <NotificationItem
                    title="Special Offers"
                    description="Exclusive discounts and promotional events for our users."
                    enabled={settings.specialOffers}
                    onToggle={() => toggleSetting('specialOffers')}
                    showBorder={false}
                  />
                </div>
              </section>


              <div className="flex justify-end pt-4 sm:pt-6">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={clsx(
                    "w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 bg-gradient-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] duration-300 flex items-center justify-center gap-2 text-sm sm:text-lg",
                    isSaving && "opacity-80 cursor-wait"
                  )}
                >
                  {isSaving ? (
                    <div className="size-5 sm:size-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <HiCheckCircle className="size-5 sm:size-6" />
                  )}
                  {isSaving ? 'Saving...' : saveSuccess ? 'Preferences Saved!' : 'Save Preferences'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationSettingsPage;
