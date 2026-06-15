import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import PswsHeader from './psws/PswsHeader';
import PswsStats from './psws/PswsStats';
import PswCard from './psws/PswCard';
import OnboardPsw from './psws/OnboardPsw';
import PswDetail from './psws/PswDetail';

const Psws = ({ onNavigate }) => {
  const { psws, onboardPsw, loading, error } = useAdmin();
  const [view, setView] = useState('list'); 
  const [selectedPsw, setSelectedPsw] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: 'Elderly Care' });

  const handleOnboard = () => {
    if (!formData.name) return;
    onboardPsw(formData);
    setView('list');
    setFormData({ name: '', role: 'Elderly Care' });
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {psws.map((psw) => (
              <PswCard 
                key={psw.id} 
                psw={psw} 
                onViewProfile={(p) => { setSelectedPsw(p); setView('detail'); }} 
                onAssignTask={() => onNavigate('Appointments')}
              />
            ))}
          </div>
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

      {view === 'detail' && (
        <PswDetail 
          psw={selectedPsw}
          onBack={() => setView('list')}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

export default Psws;
