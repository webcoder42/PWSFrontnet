import React, { useState } from 'react';
import StepIndicator from './StepIndicator';
import BookingStep1 from './BookingStep1';
import BookingStep2 from './BookingStep2';
import BookingStep3 from './BookingStep3';
import BookingStep4 from './BookingStep4';
import BookingStepClient from './BookingStepClient';

const BookingFlow = ({ onBackToDashboard, onReschedule, onSave, clients, psws }) => {
  const [bookingStep, setBookingStep] = useState(0); // 0: Client, 1: Service, 2: PSW, 3: Date/Time, 4: Success
  const [assignment, setAssignment] = useState({
    client: '',
    type: '',
    psw: '',
    date: '2025-05-16',
    time: '11:00 AM – 12:00 PM',
    status: 'Pending',
    color: 'purple'
  });

  const handleSave = () => {
    onSave(assignment);
    setBookingStep(4);
  };

  const renderBookingStep = () => {
    switch (bookingStep) {
      case 0:
        return (
          <BookingStepClient 
            clients={clients}
            selectedClient={assignment.client}
            onSelect={(clientName) => setAssignment({...assignment, client: clientName})}
            onBack={onBackToDashboard}
            onContinue={() => setBookingStep(1)}
          />
        );
      case 1:
        return (
          <BookingStep1 
            selectedService={assignment.type} 
            onServiceSelect={(type) => setAssignment({...assignment, type})} 
            onBack={() => setBookingStep(0)}
            onContinue={() => setBookingStep(2)}
          />
        );
      case 2:
        return (
          <BookingStep2 
            psws={psws}
            selectedPsw={assignment.psw}
            onSelect={(pswName) => setAssignment({...assignment, psw: pswName})}
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
      <StepIndicator currentStep={bookingStep + 1} />
      {renderBookingStep()}
    </div>
  );
};

export default BookingFlow;
