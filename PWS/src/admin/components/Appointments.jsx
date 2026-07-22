import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import ListView from './appointments/ListView';
import BookingFlow from './appointments/BookingFlow';
import RescheduleView from './appointments/RescheduleView';

const Appointments = ({ onNavigate }) => {
  const { appointments, clients, psws, addAppointment, loading, error } = useAdmin();
  const [activeView, setActiveView] = useState('list'); 
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleCreateAssignment = (assignmentData) => {
    addAppointment(assignmentData);
  };

  return (
    <div className="h-full">
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold">{error}</div>
      )}
      {loading && appointments.length === 0 && activeView === 'list' ? (
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest py-12 text-center">Loading appointments...</p>
      ) : null}
      {activeView === 'list' && (
        <ListView 
          appointments={appointments}
          onBookNew={() => setActiveView('booking')}
          onReschedule={(app) => { setSelectedAppointment(app); setActiveView('reschedule'); }}
          onViewDetails={(app) => { setSelectedAppointment(app); }}
          selectedAppointment={selectedAppointment}
          onCloseDetails={() => setSelectedAppointment(null)}
          onRescheduleFromDetails={(app) => { setSelectedAppointment(app); setActiveView('reschedule'); }}
        />
      )}
      
      {activeView === 'booking' && (
        <BookingFlow 
          onBackToDashboard={() => onNavigate ? onNavigate('Dashboard') : setActiveView('list')}
          onReschedule={() => setActiveView('reschedule')}
          onSave={handleCreateAssignment}
          clients={clients}
          psws={psws}
        />
      )}
      
      {activeView === 'reschedule' && (
        <RescheduleView 
          appointment={selectedAppointment}
          onBack={() => setActiveView('list')}
        />
      )}
    </div>
  );
};

export default Appointments;
