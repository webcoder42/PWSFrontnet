import React, { useState } from 'react';
import ReportsHeader from './reports/ReportsHeader';
import ReportsStats from './reports/ReportsStats';
import AssignmentLog from './reports/AssignmentLog';
import AdminDocuments from './reports/AdminDocuments';
import OperationsSummary from './reports/OperationsSummary';
import ExportPortal from './reports/ExportPortal';

const Reports = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('main');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedExports, setSelectedExports] = useState([0, 1, 2, 3]);

  const stats = [
    { label: 'Total Clients', value: '128', sub: 'Registered Patients', color: 'bg-purple-600', textColor: 'text-white' },
    { label: 'Active PSWs', value: '42', sub: 'On-duty Workers', color: 'bg-white', textColor: 'text-gray-900 border border-gray-50 shadow-sm' },
    { label: 'Sessions This Month', value: '312', sub: 'Completed Assignments', color: 'bg-white', textColor: 'text-gray-900 border border-gray-50 shadow-sm' },
    { label: 'Monthly Revenue', value: '$48K', sub: 'Billing Collected', color: 'bg-white', textColor: 'text-gray-900 border border-gray-50 shadow-sm' },
  ];

  const toggleExport = (i) => setSelectedExports(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  const toggleAllExports = () => setSelectedExports(prev => prev.length === 4 ? [] : [0, 1, 2, 3]);

  return (
    <div className="h-full">
      {activeTab === 'main' ? (
        <div className="animate-in fade-in duration-700">
          <ReportsHeader onExport={() => setActiveTab('export')} />
          <ReportsStats stats={stats} />
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
