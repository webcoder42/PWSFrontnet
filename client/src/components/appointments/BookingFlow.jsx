import React, { useState, useEffect } from 'react';
import StepIndicator from './StepIndicator';
import BookingStep1 from './BookingStep1';
import BookingStep2 from './BookingStep2';
import BookingStep3 from './BookingStep3';
import BookingStep4 from './BookingStep4';
import { useUser } from '../../context/UserContext';
import { getStripeWalletAPI, confirmAppointmentWithPaymentAPI, createAppointmentAPI } from '../../utils/api';

const BookingFlow = ({ onBackToDashboard, onNavigateToAppointments, onReschedule }) => {
  const { user } = useUser();
  const [bookingStep, setBookingStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    date: 'Monday, March 16, 2026',
    time: '11:00 AM',
    duration: '1 hour',
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);

  // Load payment methods when component mounts
  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (!user?._id) return;
      setIsLoadingPaymentMethods(true);
      try {
        const response = await getStripeWalletAPI(user._id);
        const methods = response.data?.wallet?.stripePaymentMethods || [];
        setPaymentMethods(methods);
        
        // Auto-select default or first card
        const defaultCard = methods.find(m => m.isDefault);
        if (defaultCard) {
          setSelectedPaymentMethodId(defaultCard.paymentMethodId);
        } else if (methods.length > 0) {
          setSelectedPaymentMethodId(methods[0].paymentMethodId);
        }
      } catch (error) {
        console.error('Failed to load payment methods:', error);
      } finally {
        setIsLoadingPaymentMethods(false);
      }
    };

    loadPaymentMethods();
  }, [user?._id]);

  const renderBookingStep = () => {
    switch (bookingStep) {
      case 1:
        return (
          <BookingStep1
            selectedService={selectedService}
            onServiceSelect={setSelectedService}
            onBack={onBackToDashboard}
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
          <BookingStep4
            selectedService={selectedService}
            selectedProvider={selectedProvider}
            bookingDetails={bookingDetails}
            isSubmitting={isSubmitting}
            paymentMethods={paymentMethods}
            selectedPaymentMethodId={selectedPaymentMethodId}
            onPaymentMethodChange={setSelectedPaymentMethodId}
            isLoadingPaymentMethods={isLoadingPaymentMethods}
            onBackToDashboard={onBackToDashboard}
            onReschedule={onReschedule}
            onNavigateToAppointments={onNavigateToAppointments}
            onConfirmBooking={async () => {
              if (isSubmitting) return { success: false, error: 'Already submitting' };
              setIsSubmitting(true);
              try {
                const rate = Number(selectedProvider?.hourlyRate) || 28;
                let durationHours = 1;
                if (bookingDetails.duration === '1.5 hours') durationHours = 1.5;
                if (bookingDetails.duration === '2 hours') durationHours = 2;
                if (bookingDetails.duration === '3+ hours') durationHours = 3;
                
                const baseCare = rate * durationHours;
                const safetyFee = baseCare * 0.1;
                const price = baseCare + safetyFee;

                const uId = user?._id && user._id.length === 24 ? user._id : '5f8d04b3b54764421b7156c0';
                const pId = selectedProvider?._id && selectedProvider._id.length === 24 ? selectedProvider._id : '5f8d04b3b54764421b7156c1';

                console.log('📱 Creating appointment...');
                
                // Step 1: Create appointment using API function
                const appointmentData = await createAppointmentAPI({
                  userId: uId,
                  pswId: pId,
                  service: selectedService?.name || 'Selected service',
                  date: bookingDetails.date,
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
