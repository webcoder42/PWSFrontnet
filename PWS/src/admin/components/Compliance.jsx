import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import ComplianceHeader from './compliance/ComplianceHeader';
import CertificationTable from './compliance/CertificationTable';

const Compliance = () => {
  const { complianceData, setComplianceData } = useAdmin();
  const [filter, setFilter] = useState('All');

  const filteredData = complianceData.filter(item => 
    filter === 'All' || item.status === filter
  );

  const handleUpdateStatus = (id, newStatus) => {
    setComplianceData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus, color: newStatus === 'Active' ? 'emerald' : newStatus === 'Expired' ? 'rose' : 'orange' } : item
    ));
  };

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <ComplianceHeader />

      <div className="flex gap-4 mb-8">
        {['All', 'Active', 'Expiring Soon', 'Expired'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              filter === f 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <CertificationTable data={filteredData} onUpdateStatus={handleUpdateStatus} />
    </div>
  );
};

export default Compliance;
