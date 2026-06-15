import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from './StepIndicator';
import BookingStep1 from './BookingStep1';
import BookingStep2 from './BookingStep2';
import BookingStep3 from './BookingStep3';
import BookingStep4 from './BookingStep4';
import BookingStepPayment from './BookingStepPayment';
import { useUser } from '../../../context/UserContext';
import { createAppointmentAPI, confirmAppointmentWithPaymentAPI } from '../../../utils/api';
import { savePendingChat } from '../../../utils/chatPending';
import { formatReadableDate, formatSlotLabel } from '../../utils/providerAvailability';
import { computeBookingEstimate } from '../../../utils/servicePricing';

const BookingFlow = ({ onBackToDashboard, onNavigateToAppointments, onReschedule }) => {
  const navigate = useNavigate();
  const { rawUser, profile } = useUser();
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedProvider(null);
    setSelectedTime(null);
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setSelectedTime(null);
  };

  const handleDateTimeSelect = ({ date, time, duration }) => {
    setSelectedDate(date);
    setSelectedTime(time);
    if (duration !== undefined) {
      setSelectedDuration(duration);
    }
  };

  const renderBookingStep = () => {
    switch (bookingStep) {
      case 1:
        return (
          <BookingStep1
            selectedService={selectedService}
            onServiceSelect={handleServiceSelect}
            onBack={onBackToDashboard}
            onContinue={() => setBookingStep(2)}
          />
        );
      case 2:
        return (
          <BookingStep2
            selectedService={selectedService}
            selectedProvider={selectedProvider}
            onProviderSelect={handleProviderSelect}
            onBack={() => setBookingStep(1)}
            onContinue={() => setBookingStep(3)}
          />
        );
      case 3:
        return (
          <BookingStep3
            selectedService={selectedService}
            selectedProvider={selectedProvider}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateTimeSelect={handleDateTimeSelect}
            onBack={() => setBookingStep(2)}
            onContinue={() => setBookingStep(4)}
          />
        );
      case 4:
        return (
          <BookingStepPayment
            selectedService={selectedService}
            selectedProvider={selectedProvider}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedDuration={selectedDuration}
            selectedPaymentMethodId={selectedPaymentMethodId}
            onPaymentMethodSelect={setSelectedPaymentMethodId}
            onBack={() => setBookingStep(3)}
            onContinue={() => setBookingStep(5)}
          />
        );
      case 5:
        return (
          <BookingStep4
            selectedService={selectedService}
            selectedProvider={selectedProvider}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedDuration={selectedDuration}
            onBackToDashboard={onBackToDashboard}
            onNavigateToAppointments={onNavigateToAppointments}
            onReschedule={onReschedule}
            isSubmitting={isSubmitting}
            onMessageProvider={() => {
              const pswId = selectedProvider?._id || selectedProvider?.id;
              if (!pswId) return;
              // Guard: never open a chat with yourself (can happen if the
              // logged-in user IS the selected provider after an account switch).
              const myId = rawUser?._id || rawUser?.id || '';
              if (String(pswId) === String(myId)) return;
              const providerName =
                selectedProvider?.fullName ||
                [selectedProvider?.firstName, selectedProvider?.lastName].filter(Boolean).join(' ') ||
                'Care Provider';
              savePendingChat({
                otherUserId: String(pswId),
                peerName: providerName,
                peerPhoto: selectedProvider?.photoUrl || '',
              });
              navigate('/patient/messages');
            }}
            onConfirmBooking={async () => {
              if (isSubmitting) return false;
              setIsSubmitting(true);
              try {
                const { total: price } = computeBookingEstimate(selectedService, selectedDuration);

                const uId = rawUser?._id || rawUser?.id || profile?.id || '5f8d04b3b54764421b7156c0';
                const pId = selectedProvider?._id || selectedProvider?.id || '5f8d04b3b54764421b7156c1';

                const formattedDate = selectedDate ? formatReadableDate(new Date(selectedDate)) : 'Date pending';
                const rawTime = selectedTime || 'Time pending';
                const durationString = selectedDuration >= 180 ? '3+ hours' : selectedDuration === 120 ? '2 hours' : selectedDuration === 90 ? '1.5 hours' : '1 hour';

                const appointmentResponse = await createAppointmentAPI({
                  userId: uId,
                  pswId: pId,
                  service: selectedService?.name || 'Respite Care',
                  date: formattedDate,
                  time: rawTime,
                  duration: durationString,
                  price: price,
                  location: '123 Queen St.'
                });

                const appointmentId = appointmentResponse?.data?._id || appointmentResponse?.data?.appointment?._id;
                if (!appointmentId) {
                  throw new Error('Failed to create appointment: No appointment ID returned');
                }

                if (!selectedPaymentMethodId) {
                  throw new Error('Please select a payment method before confirming your booking.');
                }

                await confirmAppointmentWithPaymentAPI(appointmentId, selectedPaymentMethodId, uId);
                return true;
              } catch (error) {
                console.error('Error creating appointment:', error);
                const message = error.message || 'Server error';
                alert(message.includes('already booked') ? message : `Failed to book appointment: ${message}`);
                return false;
              } finally {
                setIsSubmitting(false);
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full">
      <StepIndicator currentStep={bookingStep} />
      {renderBookingStep()}
    </div>
  );
};

export default BookingFlow;
