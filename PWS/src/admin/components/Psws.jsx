import React, { useState, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import PswsHeader from './psws/PswsHeader';
import PswsStats from './psws/PswsStats';
import PswCard from './psws/PswCard';
import OnboardPsw from './psws/OnboardPsw';
import PswDetailModal from './psws/PswDetailModal';

const CERT_TABS = [
  { key: 'all', label: 'All' },
  { key: 'approved', label: 'Verified' },
  { key: 'pending', label: 'Pending' },
  { key: 'rejected', label: 'Rejected' },
];

const Psws = ({ onNavigate }) => {
  const { psws, onboardPsw, refreshData, loading, error } = useAdmin();
  const [view, setView] = useState('list'); 
  const [selectedPswId, setSelectedPswId] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: 'Elderly Care' });
  const [certFilter, setCertFilter] = useState('all');

  const filteredPsws = useMemo(() => {
    if (certFilter === 'all') return psws;
    return psws.filter((p) => (p.pswCertificateStatus || 'pending') === certFilter);
  }, [psws, certFilter]);

  const handleOnboard = () => {
    if (!formData.name) return;
    onboardPsw(formData);
    setView('list');
    setFormData({ name: '', role: 'Elderly Care' });
  };

  const handleVerifyUpdate = (pswId, newStatus) => {
    refreshData();
  };

  return (
    <div className="h-full">
      {view === 'list' && (
        <div className="animate-in fade-in duration-700">
          <PswsHeader onOnboard={() => setView('onboard')} />
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold">{error}</div>
          )}
          {loading && psws.length === 0 ? (
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest py-12 text-center">Loading PSWs...</p>
          ) : (
          <>
          <PswsStats psws={psws} />

          <div className="bg-white/80 backdrop-blur-md p-2 rounded-[2rem] border border-gray-50 mb-10 flex items-center shadow-[0_10px_40px_rgba(0,0,0,0.02)] gap-2 w-fit">
            {CERT_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCertFilter(tab.key)}
                className={`px-8 py-3 rounded-[1.25rem] text-[10px] font-bold uppercase tracking-widest transition-all ${
                  certFilter === tab.key
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label} {tab.key !== 'all' && `(${psws.filter((p) => (p.pswCertificateStatus || 'pending') === tab.key).length})`}
              </button>
            ))}
          </div>

          {filteredPsws.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-md rounded-[3rem] border border-gray-50">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No PSWs found</h3>
              <p className="text-gray-400 text-sm">No PSWs match this filter</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPsws.map((psw) => (
              <PswCard 
                key={psw.id} 
                psw={psw} 
                onViewProfile={(p) => setSelectedPswId(p._id || p.id)} 
                onAssignTask={() => onNavigate('Appointments')}
              />
            ))}
          </div>
          )}
          </>
          )}
        </div>
      )}

      {view === 'onboard' && (
        <OnboardPsw 
          formData={formData}
          setFormData={setFormData}
          onOnboard={handleOnboard}
          onCancel={() => setView('list')}
        />
      )}

      {selectedPswId && (
        <PswDetailModal
          pswId={selectedPswId}
          onClose={() => setSelectedPswId(null)}
          onUpdate={handleVerifyUpdate}
        />
      )}
    </div>
  );
};

export default Psws;
