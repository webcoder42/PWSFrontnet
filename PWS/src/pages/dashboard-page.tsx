import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineUsers, HiChevronRight } from 'react-icons/hi';
import { FaStar } from "react-icons/fa";

import DashboardSidebar from '../components/dashboard/dashboardSidebar/dashboardSidebar';
import DashboardHeader from '../components/dashboard/dashboardHeader/dashboardHeader';
import StatCard from '../components/dashboard/statCard/statCard';
import AppointmentItem from '../components/dashboard/appointmentItem/appointmentItem';
import ClientItem from '../components/dashboard/clientItem/clientItem';
import { useUser } from '../context/UserContext';
import { getAppointmentsByPswAPI, getPswDashboardStatsAPI } from '../utils/api';
import {
  computeEarningsOverview,
  formatAppointmentTime,
  formatEarningsAmount,
  getLoggedInUserId,
  getPatientName,
  getPatientPhoto,
  parseAppointmentDate,
  parseDurationHours,
  toDisplayStatus,
} from '../utils/appointmentHelpers';
import { useLiveDataRefresh } from '../hooks/useLiveDataRefresh';

type ProfileStats = {
  rating: number;
  reviewCount: number;
  repeatClientPercent: number;
};

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<Record<string, unknown>[]>([]);
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [serverEarnings, setServerEarnings] = useState<{
    today: number;
    week: number;
    month: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { rawUser, profile } = useUser();

  const fetchAppointments = useCallback(async () => {
    const pswId = getLoggedInUserId(rawUser, profile);
    if (!pswId) {
      setLoading(false);
      return;
    }

    try {
      const [apptRes, statsRes] = await Promise.all([
        getAppointmentsByPswAPI(pswId),
        getPswDashboardStatsAPI(pswId).catch(() => null),
      ]);
      if (apptRes.success) {
        setAppointments(apptRes.data || []);
      }
      if (statsRes?.success && statsRes.data) {
        if (statsRes.data.profileStats) {
          setProfileStats(statsRes.data.profileStats as ProfileStats);
        }
        if (statsRes.data.earnings) {
          setServerEarnings(statsRes.data.earnings);
        }
      }
    } catch (err) {
      console.error('Error fetching PSW appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [rawUser, profile]);

  useEffect(() => {
    void fetchAppointments();
  }, [fetchAppointments]);

  useLiveDataRefresh(fetchAppointments, { watchDashboardStats: true });

  const upcomingForDashboard = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments
      .filter((appt) => {
        const status = String(appt.status || '').toLowerCase();
        return status === 'pending' || status === 'confirmed';
      })
      .sort((a, b) => parseAppointmentDate(a as { appointmentDate?: string; date?: string }).getTime()
        - parseAppointmentDate(b as { appointmentDate?: string; date?: string }).getTime())
      .slice(0, 5)
      .map((appt) => {
        const apptDate = parseAppointmentDate(appt as { appointmentDate?: string; date?: string });
        apptDate.setHours(0, 0, 0, 0);
        const displayStatus = toDisplayStatus(String(appt.status || ''));
        const name = getPatientName(appt.userId);
        const photo = getPatientPhoto(appt.userId);
        return {
          id: String(appt._id || ''),
          name,
          location: String(appt.location || '—'),
          image: photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
          time: formatAppointmentTime(String(appt.time || ''), String(appt.duration || '')),
          status: displayStatus === 'CONFIRMED' ? 'Confirmed' as const : 'Pending' as const,
          isToday: apptDate.getTime() === today.getTime(),
        };
      });
  }, [appointments]);

  const clientsFromAppointments = useMemo(() => {
    const clientMap = new Map<string, { name: string; type: string; image: string; visits: number }>();

    appointments.forEach((appt) => {
      const userId = appt.userId as Record<string, unknown> | string | undefined;
      const id = typeof userId === 'object' && userId?._id
        ? String(userId._id)
        : typeof userId === 'string'
          ? userId
          : String(appt._id);
      const name = getPatientName(appt.userId);
      const photo = getPatientPhoto(appt.userId);
      const existing = clientMap.get(id);
      if (existing) {
        existing.visits += 1;
      } else {
        clientMap.set(id, {
          name,
          type: String(appt.service || 'Care'),
          image: photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
          visits: 1,
        });
      }
    });

    return Array.from(clientMap.values()).slice(0, 5);
  }, [appointments]);

  const monthStats = useMemo(() => {
    const now = new Date();
    const monthAppts = appointments.filter((appt) => {
      const d = parseAppointmentDate(appt as { appointmentDate?: string; date?: string });
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const hours = monthAppts.reduce(
      (sum, appt) => sum + parseDurationHours(String(appt.duration || '')),
      0,
    );
    const earnings = monthAppts.reduce((sum, appt) => sum + (Number(appt.price) || 0), 0);
    const activePatients = new Set(
      monthAppts.map((appt) => {
        const userId = appt.userId;
        if (typeof userId === 'object' && userId && '_id' in userId) return String((userId as { _id: string })._id);
        return String(userId);
      }),
    ).size;

    return {
      hours: Math.round(hours),
      earnings: `$${Math.round(earnings).toLocaleString()}`,
      activePatients,
    };
  }, [appointments]);

  const confirmedAppointments = upcomingForDashboard.filter(
    (app) => app.status === 'Confirmed' || app.status === 'Pending',
  );

  const earningsOverview = useMemo(
    () => serverEarnings || computeEarningsOverview(appointments),
    [serverEarnings, appointments],
  );

  const earningsCards = [
    { label: 'Today', value: formatEarningsAmount(earningsOverview.today) },
    { label: 'This Week', value: formatEarningsAmount(earningsOverview.week) },
    { label: 'This Month', value: formatEarningsAmount(earningsOverview.month) },
  ];

  const providerProfile = ((rawUser as Record<string, unknown> | null)?.providerProfile || {}) as Record<
    string,
    unknown
  >;

  const displayProfileStats: ProfileStats = profileStats || {
    rating: Number(providerProfile.rating) || 0,
    reviewCount: Number(providerProfile.reviewCount) || 0,
    repeatClientPercent: Number(providerProfile.repeatClientPercent) || 0,
  };

  const ratingPercent = Math.min(100, Math.round((displayProfileStats.rating / 5) * 100));

  return (
    <div className="flex min-h-screen bg-surface-alt">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 lg:ml-72">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 space-y-6 lg:space-y-10 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            <StatCard
              title="Hours this month"
              value={String(monthStats.hours)}
              subtitle="From your bookings"
              trend="From your bookings"
              icon={HiOutlineClock}
              color="purple"
            />
            <StatCard
              title="Earning this month"
              value={monthStats.earnings}
              subtitle="Net after platform fee"
              icon={HiOutlineCurrencyDollar}
              color="pink"
            />
            <div className="sm:col-span-2 lg:col-span-1">
              <StatCard
                title="Active Patients"
                value={String(monthStats.activePatients)}
                subtitle="This month"
                icon={HiOutlineUsers}
                color="green"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-10">
            <div className="xl:col-span-2 space-y-6 lg:space-y-10">
              <div className="bg-white rounded-3xl p-6 lg:p-10 border border-gray-100 shadow-logs hover:shadow-xl hover:shadow-black/5 duration-500">
                <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 font-playfair">Upcoming Appointments</h3>
                  <button
                    onClick={() => navigate('/care-requests')}
                    className="flex items-center gap-2 text-primary font-bold font-dm text-md hover:underline underline-offset-4 self-start sm:self-auto"
                  >
                    <span>See all</span>
                    <HiChevronRight className="size-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  {loading ? (
                    <div className="py-10 text-center">
                      <p className="text-gray-400 font-dm font-medium">Loading appointments...</p>
                    </div>
                  ) : confirmedAppointments.length > 0 ? (
                    confirmedAppointments.map((app) => (
                      <AppointmentItem
                        key={app.id}
                        name={app.name}
                        location={app.location}
                        image={app.image}
                        time={app.time}
                        status={app.status}
                        isToday={app.isToday}
                      />
                    ))
                  ) : (
                    <div className="py-10 text-center">
                      <p className="text-gray-500 font-dm font-medium">No upcoming appointments yet.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 lg:p-10 border border-gray-100 shadow-logs hover:shadow-xl hover:shadow-black/5 duration-500">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 font-playfair mb-6">Earnings Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                  {earningsCards.map((item) => (
                    <div key={item.label} className="p-6 lg:p-8 rounded-2xl bg-surface-card border border-primary/10 text-center group duration-500 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-primary/10">
                      <p className="text-[#7366a0] text-sm lg:text-md font-black uppercase tracking-[0.2em] opacity-60 mb-2 lg:mb-3 font-dm">{item.label}</p>
                      <h4 className="text-3xl lg:text-4xl font-bold text-primary font-playfair tracking-tight">{item.value}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:space-y-10">
              <div className="bg-white rounded-3xl p-6 lg:p-10 border border-gray-100 shadow-logs hover:shadow-xl hover:shadow-black/5 duration-500">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 font-playfair mb-6 lg:mb-4">My Clients</h3>
                <div className="space-y-2 lg:space-y-6">
                  {loading ? (
                    <p className="text-gray-400 font-dm text-sm">Loading clients...</p>
                  ) : clientsFromAppointments.length > 0 ? (
                    clientsFromAppointments.map((client) => (
                      <ClientItem
                        key={client.name}
                        name={client.name}
                        type={client.type}
                        image={client.image}
                        visits={client.visits}
                      />
                    ))
                  ) : (
                    <p className="text-gray-400 font-dm text-sm">Clients appear when someone books with you.</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 lg:p-10 border border-gray-100 shadow-logs hover:shadow-xl hover:shadow-black/5 duration-500">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 font-playfair mb-6 lg:mb-8">Profile Stats</h3>

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm lg:text-[15px] font-bold text-gray-700 font-dm">Overall Rating</span>
                    <div className="flex gap-1 items-center justify-center">
                      <FaStar className="text-yellow-400 size-4 fill-yellow-400" />
                      <span className="text-sm lg:text-[15px] font-bold text-gray-900 font-dm">
                        {displayProfileStats.rating > 0 ? displayProfileStats.rating.toFixed(1) : '—'}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-400 rounded-full transition-all duration-500"
                      style={{ width: `${ratingPercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 lg:p-6 rounded-2xl bg-surface-card border border-primary/10 text-center shadow-sm hover:shadow-md duration-300">
                    <h4 className="text-3xl lg:text-4xl font-bold text-primary font-playfair tracking-tight">
                      {displayProfileStats.reviewCount}
                    </h4>
                    <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mt-1 font-dm">Reviews</p>
                  </div>
                  <div className="p-4 lg:p-6 rounded-2xl bg-surface-card border border-primary/10 text-center shadow-sm hover:shadow-md duration-300">
                    <h4 className="text-3xl lg:text-4xl font-bold text-primary font-playfair tracking-tight">
                      {displayProfileStats.repeatClientPercent}%
                    </h4>
                    <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mt-1 font-dm">Repeat clients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
