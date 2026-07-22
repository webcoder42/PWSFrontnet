import React, { useState } from 'react';
import ListView from './appointments/ListView';
import BookingFlow from './appointments/BookingFlow';
import RescheduleView from './appointments/RescheduleView';

const Appointments = ({ onNavigate }) => {
  const [activeView, setActiveView] = useState(() => {
    const saved = localStorage.getItem('pws_booking_state');
    return saved ? 'booking' : 'list';
  });

  return (
    <div className="h-full">
      {activeView === 'list' && (
        <ListView 
          onBookNew={() => setActiveView('booking')}
          onReschedule={() => setActiveView('reschedule')}
          onViewDetails={() => setActiveView('booking')}
        />
      )}
      
      {activeView === 'booking' && (
        <BookingFlow 
          onBackToDashboard={() => onNavigate ? onNavigate('Dashboard') : setActiveView('list')}
          onNavigateToAppointments={() => setActiveView('list')}
          onReschedule={() => setActiveView('reschedule')}
          onNavigate={onNavigate}
        />
      )}
      
      {activeView === 'reschedule' && (
        <RescheduleView 
          onBack={() => setActiveView('list')}
        />
      )}
    </div>
  );
};

export default Appointments;
