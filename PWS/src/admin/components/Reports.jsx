import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import ReportsHeader from './reports/ReportsHeader';
import ReportsStats from './reports/ReportsStats';
import AssignmentLog from './reports/AssignmentLog';
import AdminDocuments from './reports/AdminDocuments';
import OperationsSummary from './reports/OperationsSummary';
import ExportPortal from './reports/ExportPortal';
import PswReportPage from './reports/PswReportPage';

const Reports = ({ onNavigate }) => {
  const { clients, psws, appointments, stats, overview } = useAdmin();
  const [activeTab, setActiveTab] = useState('main');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedExports, setSelectedExports] = useState([0, 1, 2, 3]);

  const totalRevenue = overview?.revenue ?? appointments.reduce((sum, a) => sum + (a.price || 0), 0);
  const monthlySessions = stats?.monthlySessions ?? appointments.filter(a => a.status !== 'cancelled').length;

  const formatRevenue = (amount) => {
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const statsData = [
    { label: 'Total Clients', value: String(stats?.totalClients ?? clients.length), sub: 'Registered Patients', color: 'bg-purple-600', textColor: 'text-white' },
    { label: 'Active PSWs', value: String(stats?.totalPsws ?? psws.length), sub: 'On-duty Workers', color: 'bg-white', textColor: 'text-gray-900 border border-gray-50 shadow-sm' },
    { label: 'Sessions This Month', value: String(monthlySessions), sub: 'Completed Assignments', color: 'bg-white', textColor: 'text-gray-900 border border-gray-50 shadow-sm' },
    { label: 'Monthly Revenue', value: formatRevenue(totalRevenue), sub: 'Billing Collected', color: 'bg-white', textColor: 'text-gray-900 border border-gray-50 shadow-sm' },
  ];

  const toggleExport = (i) => setSelectedExports(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  const toggleAllExports = () => setSelectedExports(prev => prev.length === 4 ? [] : [0, 1, 2, 3]);

  return (
    <div className="h-full">
      {activeTab === 'main' ? (
        <div className="animate-in fade-in duration-700">
          <ReportsHeader onExport={() => setActiveTab('export')} onPswReport={() => setActiveTab('psw-report')} />
          <ReportsStats stats={statsData} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            <AssignmentLog 
              appointments={appointments}
              activeFilter={activeFilter} 
              setActiveFilter={setActiveFilter} 
              onNavigate={onNavigate} 
            />
            <div className="space-y-8">
              <AdminDocuments />
              <OperationsSummary appointments={appointments} psws={psws} overview={overview} />
            </div>
          </div>
        </div>
      ) : activeTab === 'psw-report' ? (
        <PswReportPage onBack={() => setActiveTab('main')} />
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
