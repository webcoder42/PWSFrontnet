import React, { useState } from 'react';
import ListView from './appointments/ListView';
import BookingFlow from './appointments/BookingFlow';
import RescheduleView from './appointments/RescheduleView';
import AppointmentDetailsView from './appointments/AppointmentDetailsView';

const Appointments = ({ onNavigate }) => {
  const [activeView, setActiveView] = useState('list'); // 'list', 'booking', 'reschedule', or 'details'
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [listRefreshKey, setListRefreshKey] = useState(0);

  return (
    <div className="h-full">
      {activeView === 'list' && (
        <ListView 
          key={listRefreshKey}
          refreshKey={listRefreshKey}
          onBookNew={() => setActiveView('booking')}
          onReschedule={() => setActiveView('reschedule')}
          onViewDetails={(appointment) => {
            setSelectedAppointment(appointment);
            setActiveView('details');
          }}
        />
      )}
      
      {activeView === 'booking' && (
        <BookingFlow 
          onBackToDashboard={() => setActiveView('list')}
          onNavigateToAppointments={() => setActiveView('list')}
          onReschedule={() => setActiveView('reschedule')}
        />
      )}
      
      {activeView === 'reschedule' && (
        <RescheduleView 
          appointment={selectedAppointment}
          onBack={() => setActiveView(selectedAppointment ? 'details' : 'list')}
          onDone={() => setActiveView('list')}
        />
      )}

      {activeView === 'details' && (
        <AppointmentDetailsView
          appointment={selectedAppointment}
          onBack={() => setActiveView('list')}
          onReschedule={() => setActiveView('reschedule')}
          onRatingSubmitted={() => setListRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
};

export default Appointments;
