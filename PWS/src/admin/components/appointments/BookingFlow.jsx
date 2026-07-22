import React, { useState } from 'react';
import StepIndicator from './StepIndicator';
import BookingStep1 from './BookingStep1';
import BookingStep2 from './BookingStep2';
import BookingStep3 from './BookingStep3';
import BookingStep4 from './BookingStep4';
import { useUser } from '../../../context/UserContext';

const todayStr = () => new Date().toISOString().split('T')[0];

const BookingFlow = ({ onBackToDashboard, onReschedule, onSave, clients, psws }) => {
  const { profile } = useUser();
  const adminName = profile?.name || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'Admin';
  const adminId = profile?._id || profile?.id || null;
  const [bookingStep, setBookingStep] = useState(1); // 1: Service, 2: PSW, 3: Date/Time, 4: Success
  const [assignment, setAssignment] = useState({
    client: adminName,
    clientId: adminId,
    type: '',
    psw: '',
    pswId: null,
    date: todayStr(),
    time: '11:00 AM – 12:00 PM',
    duration: '1 hour',
    price: 0,
    location: '',
    status: 'Pending',
    color: 'purple'
  });

  const handleSave = () => {
    onSave({
      ...assignment,
      date: assignment.date || todayStr(),
      duration: assignment.duration || '1 hour',
      price: assignment.price || 30,
      location: assignment.location || 'Client home',
    });
    setBookingStep(4);
  };

  const renderBookingStep = () => {
    switch (bookingStep) {
      case 1:
        return (
          <BookingStep1 
            selectedService={assignment.type} 
            onServiceSelect={(type) => setAssignment({...assignment, type})} 
            onBack={onBackToDashboard}
            onContinue={() => setBookingStep(2)}
          />
        );
      case 2:
        return (
          <BookingStep2 
            psws={psws}
            selectedPsw={assignment.psw}
            onSelect={(pswName, pswId) => setAssignment({...assignment, psw: pswName, pswId})}
            onBack={() => setBookingStep(1)}
            onContinue={() => setBookingStep(3)}
          />
        );
      case 3:
        return (
          <BookingStep3 
            assignment={assignment}
            onUpdate={(updates) => setAssignment({...assignment, ...updates})}
            onBack={() => setBookingStep(2)}
            onContinue={handleSave}
          />
        );
      case 4:
        return (
          <BookingStep4 
            assignment={assignment}
            onBackToDashboard={onBackToDashboard}
            onReschedule={onReschedule}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full">
      {bookingStep <= 3 && <StepIndicator currentStep={bookingStep} />}
      {renderBookingStep()}
    </div>
  );
};

export default BookingFlow;
