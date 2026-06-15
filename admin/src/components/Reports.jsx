import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import ReportsHeader from './reports/ReportsHeader';
import ReportsStats from './reports/ReportsStats';
import AssignmentLog from './reports/AssignmentLog';
import AdminDocuments from './reports/AdminDocuments';
import OperationsSummary from './reports/OperationsSummary';
import ExportPortal from './reports/ExportPortal';

const Reports = ({ onNavigate }) => {
  const { clients, psws, appointments, stats } = useAdmin();
  const [activeTab, setActiveTab] = useState('main');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedExports, setSelectedExports] = useState([0, 1, 2, 3]);
  const activeBookingCount = appointments.filter((app) => ['confirmed', 'pending', 'scheduled', 'in-progress'].includes(app.status)).length;

  const statsData = [
    {
      label: 'Total Clients',
      value: String(stats?.totalClients ?? clients.length),
      sub: 'Registered Patients',
      color: 'bg-purple-600',
      textColor: 'text-white',
    },
    {
      label: 'Total Users',
      value: String(clients.length),
      sub: 'User accounts in database',
      color: 'bg-white',
      textColor: 'text-gray-900 border border-gray-50 shadow-sm',
    },
    {
      label: 'Active PSWs',
      value: String(stats?.totalPsws ?? psws.length),
      sub: 'On-duty workers',
      color: 'bg-white',
      textColor: 'text-gray-900 border border-gray-50 shadow-sm',
    },
    {
      label: "Today's Sessions",
      value: String(stats?.todaysSessions ?? appointments.filter((app) => app.status === 'confirmed' || app.status === 'pending').length),
      sub: 'Upcoming Assignments',
      color: 'bg-white',
      textColor: 'text-gray-900 border border-gray-50 shadow-sm',
    },
    {
      label: 'Open Bookings',
      value: String(activeBookingCount),
      sub: 'Active booking requests',
      color: 'bg-white',
      textColor: 'text-gray-900 border border-gray-50 shadow-sm',
    },
    {
      label: 'Monthly Revenue',
      value: `$${(appointments.reduce((sum, app) => sum + (app.price || 0), 0) || 0).toLocaleString()}`,
      sub: 'Billing Collected',
      color: 'bg-white',
      textColor: 'text-gray-900 border border-gray-50 shadow-sm',
    },
  ];

  const toggleExport = (i) => setSelectedExports(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  const toggleAllExports = () => setSelectedExports(prev => prev.length === 4 ? [] : [0, 1, 2, 3]);

  return (
    <div className="h-full">
      {activeTab === 'main' ? (
        <div className="animate-in fade-in duration-700">
          <ReportsHeader onExport={() => setActiveTab('export')} />
          <ReportsStats stats={statsData} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            <AssignmentLog 
              activeFilter={activeFilter} 
              setActiveFilter={setActiveFilter} 
              onNavigate={onNavigate} 
            />
            <div className="space-y-8">
              <AdminDocuments />
              <OperationsSummary />
            </div>
          </div>
        </div>
      ) : (
        <ExportPortal 
          selectedExports={selectedExports}
          toggleExport={toggleExport}
          toggleAllExports={toggleAllExports}
          onCancel={() => setActiveTab('main')}
        />
      )}
    </div>
  );
};

export default Reports;
