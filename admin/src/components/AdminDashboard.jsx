import React from 'react';
import { useAdmin } from '../context/AdminContext';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardStats from './dashboard/DashboardStats';
import PerformanceAnalytics from './dashboard/PerformanceAnalytics';
import RecentAssignments from './dashboard/RecentAssignments';
import TopPsws from './dashboard/TopPsws';
import AdminPortals from './dashboard/AdminPortals';

const AdminDashboard = ({ onNavigate }) => {
  const { appointments, psws, clients, dashboardStats, loading, error } = useAdmin();
  const activeBookings = appointments.filter((app) => ['confirmed', 'pending', 'scheduled', 'in-progress'].includes(app.status)).length;

  const getMonthlyAnalytics = (appointmentsList) => {
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const months = Array.from({ length: 6 }).map((_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: monthNames[date.getMonth()],
        value: 0,
      };
    });

    appointmentsList.forEach((appointment) => {
      const appointmentDate = appointment?.appointmentDate ? new Date(appointment.appointmentDate) : appointment?.date ? new Date(appointment.date) : null;
      if (!appointmentDate || Number.isNaN(appointmentDate.getTime())) return;

      const monthKey = `${appointmentDate.getFullYear()}-${appointmentDate.getMonth()}`;
      const monthItem = months.find((item) => item.key === monthKey);
      if (monthItem && appointment.status !== 'cancelled') {
        monthItem.value += 1;
      }
    });

    return months.map(({ key, ...rest }) => rest);
  };

  const analyticsData = getMonthlyAnalytics(appointments);

  if (loading && !appointments.length && !psws.length) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400 font-bold text-sm uppercase tracking-widest">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <DashboardHeader />
      {error && (
        <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold">
          {error}
        </div>
      )}
      <DashboardStats stats={dashboardStats} />

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8 mb-10">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gray-400 font-bold mb-2">User overview</p>
              <h3 className="text-2xl font-bold text-gray-900">Latest active users</h3>
            </div>
            <button onClick={() => onNavigate('Users')} className="text-purple-600 text-xs font-bold uppercase tracking-widest hover:text-purple-800 transition-colors">View all users</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="rounded-[2rem] bg-purple-50 p-5">
              <p className="text-[10px] uppercase tracking-[0.35em] text-purple-500 font-bold mb-3">Users</p>
              <p className="text-3xl font-bold text-purple-700">{clients.length}</p>
              <p className="text-[11px] text-purple-500 mt-2">Total registered users</p>
            </div>
            <div className="rounded-[2rem] bg-rose-50 p-5">
              <p className="text-[10px] uppercase tracking-[0.35em] text-rose-500 font-bold mb-3">Active clients</p>
              <p className="text-3xl font-bold text-rose-700">{clients.filter((client) => client.status === 'Active').length}</p>
              <p className="text-[11px] text-rose-500 mt-2">Currently active accounts</p>
            </div>
            <div className="rounded-[2rem] bg-emerald-50 p-5">
              <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-600 font-bold mb-3">Open bookings</p>
              <p className="text-3xl font-bold text-emerald-700">{activeBookings}</p>
              <p className="text-[11px] text-emerald-500 mt-2">Bookings in progress</p>
            </div>
          </div>
          <div className="space-y-3 max-h-[340px] overflow-y-auto custom-scrollbar">
            {clients.length ? (
              clients.slice(0, 8).map((client) => (
                <div key={client._id || client.id || client.email} className="flex items-center justify-between gap-4 p-4 rounded-3xl border border-gray-100 hover:border-purple-100 transition-colors">
                  <div>
                    <p className="font-bold text-gray-900 truncate">{client.name || client.email || 'Unnamed user'}</p>
                    <p className="text-xs text-gray-400 truncate">{client.email || 'No email provided'}</p>
                  </div>
                  <span className={`px-3 py-1 text-[11px] font-bold rounded-full ${client.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : client.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{client.status || 'Unknown'}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400 text-sm">No users available yet. Refresh to load from the database.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2.5rem] p-8 bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-xl border border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-purple-200 font-bold mb-3">Booking snapshot</p>
                <h3 className="text-3xl font-bold">Open booking activity</h3>
                <p className="text-sm text-purple-100/90 mt-2">Keep an eye on active sessions and appointment load.</p>
              </div>
              <div className="rounded-3xl bg-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.35em] text-white">Live data</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-[10px] uppercase tracking-[0.35em] text-purple-200 font-bold">Open bookings</p>
                <p className="text-4xl font-bold mt-4">{activeBookings}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-[10px] uppercase tracking-[0.35em] text-purple-200 font-bold">Total appointments</p>
                <p className="text-4xl font-bold mt-4">{appointments.length}</p>
              </div>
            </div>
          </div>
          <TopPsws psws={psws} onManageAll={() => onNavigate('PSWs')} />
        </div>
      </div>
      <PerformanceAnalytics data={analyticsData} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <RecentAssignments
          appointments={appointments}
          onNavigate={onNavigate}
          onViewAll={() => onNavigate('Appointments')}
        />

        <div className="lg:col-span-4 space-y-10">
          <TopPsws psws={psws} onManageAll={() => onNavigate('PSWs')} />
          <AdminPortals onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
