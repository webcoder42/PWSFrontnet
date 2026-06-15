import React from 'react';
import { useAdmin } from '../context/AdminContext';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardStats from './dashboard/DashboardStats';
import PerformanceAnalytics from './dashboard/PerformanceAnalytics';
import RecentAssignments from './dashboard/RecentAssignments';
import TopPsws from './dashboard/TopPsws';
import AdminPortals from './dashboard/AdminPortals';

const AdminDashboard = ({ onNavigate }) => {
  const { appointments, psws, dashboardStats, loading, error } = useAdmin();

  const analyticsData = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 80 },
    { label: 'Mar', value: 95 },
    { label: 'Apr', value: 70 },
    { label: 'May', value: 85 },
    { label: 'Jun', value: 110 },
  ];

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
