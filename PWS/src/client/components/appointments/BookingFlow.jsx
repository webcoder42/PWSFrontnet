import React, { useState, useEffect } from 'react';
import StepIndicator from './StepIndicator';
import BookingStep1 from './BookingStep1';
import BookingStep2 from './BookingStep2';
import BookingStep3 from './BookingStep3';
import BookingStepPayment from './BookingStepPayment';
import BookingStep4 from './BookingStep4';
import { useUser } from '../../context/UserContext';
import { useStripeWalletQuery } from '../../hooks/useClientQueries';
import { confirmAppointmentWithPaymentAPI, createAppointmentAPI } from '../../utils/api';
import { computeBookingEstimate, findBookingService } from '../../utils/servicePricing';

const BookingFlow = ({ onBackToDashboard, onNavigateToAppointments, onReschedule, onNavigate }) => {
  const savedState = (() => {
    try {
      const val = localStorage.getItem('pws_booking_state');
      return val ? JSON.parse(val) : null;
    } catch (e) {
      return null;
    }
  })();

  const { user } = useUser();
  const [bookingStep, setBookingStep] = useState(() => savedState?.bookingStep || 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState(() => savedState?.selectedService || null);
  const [selectedProvider, setSelectedProvider] = useState(() => savedState?.selectedProvider || null);
  const [bookingDetails, setBookingDetails] = useState(() => savedState?.bookingDetails || {
    date: '',
    dateInput: '',
    time: '',
    duration: '1 hour',
  });
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(() => savedState?.selectedPaymentMethodId || null);

  const uId = user?._id || user?.id;
  const { data: walletData, isLoading: isLoadingPaymentMethods } = useStripeWalletQuery(uId);
  const paymentMethods = walletData?.data?.wallet?.stripePaymentMethods || [];

  // Auto-select default or first card when payment methods load
  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentMethodId) {
      const defaultCard = paymentMethods.find(m => m.isDefault);
      setSelectedPaymentMethodId(defaultCard ? defaultCard.paymentMethodId : paymentMethods[0].paymentMethodId);
    }
  }, [paymentMethods, selectedPaymentMethodId]);

  // Save booking state to localStorage
  useEffect(() => {
    if (bookingStep > 1) {
      const stateToSave = {
        bookingStep,
        selectedService,
        selectedProvider,
        bookingDetails,
        selectedPaymentMethodId,
      };
      localStorage.setItem('pws_booking_state', JSON.stringify(stateToSave));
    }
  }, [bookingStep, selectedService, selectedProvider, bookingDetails, selectedPaymentMethodId]);

  const clearSavedState = () => {
    localStorage.removeItem('pws_booking_state');
  };

  const handleBackToDashboard = () => {
    clearSavedState();
    if (onBackToDashboard) onBackToDashboard();
  };

  const handleNavigateToAppointments = () => {
    clearSavedState();
    if (onNavigateToAppointments) onNavigateToAppointments();
  };

  const renderBookingStep = () => {
    switch (bookingStep) {
      case 1:
        return (
          <BookingStep1
            selectedService={selectedService}
            onServiceSelect={setSelectedService}
            onBack={handleBackToDashboard}
            onContinue={() => setBookingStep(2)}
          />
        );
      case 2:
        return (
          <BookingStep2
            selectedService={selectedService}
            selectedProvider={selectedProvider}
            onProviderSelect={setSelectedProvider}
            onBack={() => setBookingStep(1)}
            onContinue={() => setBookingStep(3)}
          />
        );
      case 3:
        return (
          <BookingStep3
            selectedService={selectedService}
            selectedProvider={selectedProvider}
            bookingDetails={bookingDetails}
            onBookingDetailsChange={setBookingDetails}
            isSubmitting={isSubmitting}
            onBack={() => setBookingStep(2)}
            onContinue={() => setBookingStep(4)}
          />
        );
      case 4:
        return (
          <BookingStepPayment
            selectedService={selectedService}
            bookingDetails={bookingDetails}
            paymentMethods={paymentMethods}
            selectedPaymentMethodId={selectedPaymentMethodId}
            onPaymentMethodChange={setSelectedPaymentMethodId}
            isLoadingPaymentMethods={isLoadingPaymentMethods}
            onBack={() => setBookingStep(3)}
            onContinue={() => setBookingStep(5)}
            onNavigate={onNavigate}
          />
        );
      case 5:
        return (
          <BookingStep4
            selectedService={selectedService}
            selectedProvider={selectedProvider}
            bookingDetails={bookingDetails}
            isSubmitting={isSubmitting}
            paymentMethods={paymentMethods}
            selectedPaymentMethodId={selectedPaymentMethodId}
            isLoadingPaymentMethods={isLoadingPaymentMethods}
            onBack={() => setBookingStep(4)}
            onBackToDashboard={handleBackToDashboard}
            onReschedule={onReschedule}
            onNavigateToAppointments={handleNavigateToAppointments}
            onConfirmBooking={async () => {
              if (isSubmitting) return { success: false, error: 'Already submitting' };
              setIsSubmitting(true);
              try {
                // Duration in minutes for computeBookingEstimate (matching mobile app)
                const durationMinutes = (() => {
                  const lower = String(bookingDetails.duration || '').toLowerCase();
                  if (lower.includes('1.5')) return 90;
                  if (lower.includes('2.5')) return 150;
                  if (lower.includes('3.5')) return 210;
                  if (lower.includes('3+') || lower.includes('3 ')) return 180;
                  if (lower.includes('4')) return 240;
                  if (lower.includes('2')) return 120;
                  if (lower.includes('hour')) return 60;
                  const match = lower.match(/(\d+)/);
                  return match ? Number(match[1]) * 60 : 60;
                })();
                const estimate = computeBookingEstimate(selectedService, durationMinutes);
                const price = Number(estimate.total.toFixed(2));

                const uId = user?._id || user?.id;
                const pId = selectedProvider?._id;

                if (!uId) {
                  return {
                    success: false,
                    error: 'No authenticated patient session found. Please sign in again.'
                  };
                }

                if (!pId) {
                  return {
                    success: false,
                    error: 'No care provider selected. Please pick a provider first.'
                  };
                }

                if (!bookingDetails?.time) {
                  return {
                    success: false,
                    error: 'Please select an appointment time before confirming.'
                  };
                }

                if (!bookingDetails?.duration) {
                  return {
                    success: false,
                    error: 'Please select an appointment duration before confirming.'
                  };
                }

                const appointmentDate = bookingDetails.dateInput || bookingDetails.date;
                if (!appointmentDate) {
                  return {
                    success: false,
                    error: 'Please select an appointment date before confirming.'
                  };
                }

                console.log('📱 Creating appointment...');
                
                const appointmentData = await createAppointmentAPI({
                  userId: uId,
                  pswId: pId,
                  service: selectedService?.name || 'Selected service',
                  date: appointmentDate,
                  time: bookingDetails.time,
                  duration: bookingDetails.duration,
                  price: price,
                  location: '123 Queen St.' // Default for now
                });

                const newAppointmentId = appointmentData.data?._id;
                
                if (!newAppointmentId) {
                  console.error('❌ No appointment ID returned');
                  return { 
                    success: false, 
                    error: 'Failed to create appointment'
                  };
                }

                console.log('✅ Appointment created:', newAppointmentId);

                // Step 2: Process payment if payment method is selected
                if (selectedPaymentMethodId) {
                  console.log('💳 Processing payment with card:', selectedPaymentMethodId);
                  try {
                    const paymentResult = await confirmAppointmentWithPaymentAPI(
                      newAppointmentId, 
                      selectedPaymentMethodId, 
                      uId
                    );
                    
                    console.log('✅ Payment processed:', paymentResult);
                    clearSavedState();
                    
                    return {
                      success: true,
                      chargeId: paymentResult.chargeId,
                      message: paymentResult.message
                    };
                  } catch (paymentError) {
                    console.error('❌ Payment processing failed:', paymentError);
                    return {
                      success: false,
                      error: paymentError.message || 'Payment processing failed'
                    };
                  }
                }

                // No payment method selected - just return success
                clearSavedState();
                return {
                  success: true,
                  chargeId: null,
                  message: 'Appointment created successfully'
                };
              } catch (error) {
                console.error('❌ Error creating appointment:', error);
                return {
                  success: false,
                  error: error.message || 'Network error. Please try again.'
                };
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
