import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProviderProfileFormData, ProfileErrors } from '../types/profile';
import { registerUserAPI } from '../utils/api';
import { encryptData } from '../utils/security';

interface UseProviderProfileStateReturn {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  formData: ProviderProfileFormData;
  setFormData: Dispatch<SetStateAction<ProviderProfileFormData>>;
  errors: ProfileErrors;
  setErrors: Dispatch<SetStateAction<ProfileErrors>>;
  handleContinue: () => void;
  handleBack: () => void;
  handleUsernameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCardNumberChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCardExpiryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCardCvvChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const useProviderProfileState = (): UseProviderProfileStateReturn => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<ProviderProfileFormData>({
    appLanguage: 'English',
    spokenLanguages: ['English', 'Punjabi'],
    firstName: '',
    lastName: '',
    professionalTitle: '',
    profilePhoto: '',
    email: sessionStorage.getItem('signup_email') || '',
    phone: '',
    countryCode: '+1',
    countryFlag: '🇨🇦',
    altContactName: '',
    altContactPhone: '',
    altCountryCode: '+1',
    altCountryFlag: '🇨🇦',
    smsAlerts: true,
    emailAlerts: true,
    messageAlerts: true,
    streetAddress: '',
    postalCode: '',
    city: '',
    province: '',
    serviceRadius: 25,
    gender: 'Female',
    pronouns: '',
    showGender: true,
    pswCertificate: null,
    pswCertificateName: '',
    backgroundCheck: null,
    backgroundCheckName: '',
    yearsExperience: '8 Years',
    specializations: [],
    professionalBio: '',
    services: [],
    availability: {
      Morning: { Mon: true, Tue: false, Wed: true, Thu: false, Fri: true, Sat: true, Sun: false },
      Afternoon: { Mon: true, Tue: false, Wed: true, Thu: false, Fri: false, Sat: false, Sun: false },
      Evening: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
      Overnight: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false }
    },
    height: '',
    weight: '',
    heightValue: 66,
    heightUnit: 'ft',
    weightValue: 150,
    weightUnit: 'lbs',
    hasVehicle: true,
    driversLicense: '',
    usesPublicTransit: true,
    usesBicycle: false,
    physicalCapabilities: [],
    payoutMethod: 'Direct Bank Deposit',
    accountHolderName: '',
    institutionNumber: '',
    transitNumber: '',
    accountNumber: '',
    bankName: '',
    stripeEmail: '',
    paypalEmail: '',
    interacEmail: '',
    debitCardName: '',
    debitCardNumber: '',
    debitCardExpiry: '',
    username: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const [errors, setErrors] = useState<ProfileErrors>({
    username: ''
  });

  useEffect(() => {
    const newErrors: ProfileErrors = {
      username: '',
      gender: '',
      certFile: '',
      backcheckFile: '',
      payout: ''
    };

    if (formData.username && formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    }

    if (formData.payoutMethod === 'Direct Bank Deposit') {
      if (!formData.accountHolderName.trim()) {
        newErrors.payout = 'Account holder name is required';
      } else if (!/^\d{3}$/.test(formData.institutionNumber)) {
        newErrors.payout = 'Institution number must be 3 digits';
      } else if (!/^\d{5}$/.test(formData.transitNumber)) {
        newErrors.payout = 'Transit number must be 5 digits';
      } else if (!/^\d{7,12}$/.test(formData.accountNumber)) {
        newErrors.payout = 'Account number must be 7-12 digits';
      } else if (!formData.bankName) {
        newErrors.payout = 'Please select a bank';
      }
    } else if (formData.payoutMethod === 'Debit Card') {
      if (!formData.debitCardName.trim()) {
        newErrors.payout = 'Cardholder name is required';
      } else if (formData.debitCardNumber.length < 19) {
        newErrors.payout = 'Complete card number is required';
      }
    } else if (formData.payoutMethod === 'Stripe') {
      if (!formData.stripeEmail || !formData.stripeEmail.includes('@')) {
        newErrors.payout = 'Valid Stripe email is required';
      }
    } else if (formData.payoutMethod === 'PayPal') {
      if (!formData.paypalEmail || !formData.paypalEmail.includes('@')) {
        newErrors.payout = 'Valid PayPal email is required';
      }
    } else if (formData.payoutMethod === 'Interac e-Transfer') {
      if (!formData.interacEmail || !formData.interacEmail.includes('@')) {
        newErrors.payout = 'Valid email is required for e-Transfer';
      }
    }

    setErrors(newErrors);
  }, [formData]);

  const validateUsername = (val: string) => {
    if (!val) return '';
    const cleanVal = val.replace(/^@/, '');
    if (cleanVal.length < 12 || cleanVal.length > 20) return 'Username must be 12-20 characters';
    if (!/^[a-zA-Z0-9]+$/.test(cleanVal)) return 'Only letters and numbers allowed';
    return '';
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, username: val });
    setErrors({ ...errors, username: validateUsername(val) });
  };

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const truncated = rawValue.slice(0, 16);
    const formatted = truncated.replace(/(\d{4})(?=\d)/g, '$1 ');
    setFormData({ ...formData, cardNumber: formatted });
  };

  const handleCardExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    let inputVal = e.target.value;
    if (formData.cardExpiry.length === 3 && inputVal.length === 2 && formData.cardExpiry.includes('/')) {
      inputVal = inputVal.slice(0, 1);
    }
    const rawValue = inputVal.replace(/\D/g, '');
    let formatted = rawValue.slice(0, 4);
    if (formatted.length >= 3) {
      formatted = `${formatted.slice(0, 2)}/${formatted.slice(2, 4)}`;
    } else if (formatted.length === 2 && inputVal.length > formData.cardExpiry.length) {
      formatted = `${formatted}/`;
    }
    setFormData({ ...formData, cardExpiry: formatted });
  };

  const handleCardCvvChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 3);
    setFormData({ ...formData, cardCvv: val });
  };

  const handleContinue = async () => {
    if (currentStep < 11) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        const email = sessionStorage.getItem('signup_email') || formData.email;
        const password = sessionStorage.getItem('signup_password') || 'password123';
        const role = sessionStorage.getItem('signup_role') || 'care_provider';

        if (!email) {
          alert('Email not found. Please sign up again.');
          navigate('/signup');
          return;
        }

        // Map availability format from frontend to backend structure
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayAbbrs = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const slots = ['Morning', 'Afternoon', 'Evening', 'Overnight'];
        
        const backendAvail: any = {};
        days.forEach((day, index) => {
          const abbr = dayAbbrs[index];
          const daySlots: string[] = [];
          slots.forEach(slot => {
            if (formData.availability[slot as keyof typeof formData.availability]?.[abbr as any]) {
              daySlots.push(slot);
            }
          });
          backendAvail[day] = daySlots;
        });

        // Map transportation
        let transType: 'own_vehicle' | 'public_transit' | 'bicycle' | 'none' = 'none';
        if (formData.hasVehicle) {
          transType = 'own_vehicle';
        } else if (formData.usesPublicTransit) {
          transType = 'public_transit';
        } else if (formData.usesBicycle) {
          transType = 'bicycle';
        }

        const yearsOfExperience = parseInt(formData.yearsExperience) || 0;

        const firstName = formData.firstName.trim() || 'Test';
        const lastName = formData.lastName.trim() || 'User';
        const phone = formData.phone.trim() ? `${formData.countryCode}${formData.phone.replace(/\D/g, '')}` : '';
        const street = formData.streetAddress.trim() || '123 Care Street';
        const postalCode = formData.postalCode.trim() || 'M5V 2T6';
        const city = formData.city.trim() || 'Toronto';
        const province = formData.province.trim() || 'ON';

        let photoUrl = formData.profilePhoto || undefined;
        let pswCertificateUrl = typeof formData.pswCertificate === 'string' && formData.pswCertificate.startsWith('data:') ? formData.pswCertificate : undefined;
        let backgroundCheckUrl = typeof formData.backgroundCheck === 'string' && formData.backgroundCheck.startsWith('data:') ? formData.backgroundCheck : undefined;

        const payload = {
          email,
          password,
          role,
          language: formData.appLanguage,
          firstName,
          lastName,
          username: formData.username || undefined,
          photoUrl,
          phone,
          notificationPreferences: {
            smsReminders: formData.smsAlerts,
            emailUpdates: formData.emailAlerts
          },
          address: {
            street,
            postalCode,
            city,
            province,
            ...(formData.latitude && formData.longitude ? {
              geojson: {
                type: 'Point' as const,
                coordinates: [formData.longitude, formData.latitude]
              }
            } : {})
          },
          gender: formData.gender,
          pronouns: formData.pronouns || undefined,
          physicalStats: {
            height: {
              value: formData.heightValue,
              unit: formData.heightUnit
            },
            weight: {
              value: formData.weightValue,
              unit: formData.weightUnit
            }
          },
          providerProfile: {
            pswCertificateUrl,
            pswCertificateStatus: 'pending',
            backgroundCheckUrl,
            backgroundCheckStatus: 'pending',
            pswCertificates: pswCertificateUrl ? [{ url: pswCertificateUrl, status: 'pending', uploadedAt: new Date(), fileName: pswCertificateUrl.split('/').pop() || 'certificate' }] : [],
            backgroundChecks: backgroundCheckUrl ? [{ url: backgroundCheckUrl, status: 'pending', uploadedAt: new Date(), fileName: backgroundCheckUrl.split('/').pop() || 'background-check' }] : [],
            yearsOfExperience,
            specializations: formData.specializations,
            bio: formData.professionalBio || 'No biography details provided.',
            servicesProvided: formData.services,
            availability: backendAvail,
            timeOff: [],
            bookingSettings: {
              minimumNoticeHours: 24,
              maxBookingAdvanceDays: 30,
              autoConfirm: false
            },
            physicalCapabilities: formData.physicalCapabilities,
            transportation: {
              type: transType,
              driversLicense: formData.driversLicense || undefined
            }
          }
        };

        const res = await registerUserAPI(payload);

        const userEmail = payload.email || sessionStorage.getItem('signup_email') || '';

        sessionStorage.removeItem('signup_email');
        sessionStorage.removeItem('signup_password');
        sessionStorage.removeItem('signup_role');
        sessionStorage.removeItem('signup_care_type');

        navigate(`/verify-email?email=${encodeURIComponent(userEmail)}`);
      } catch (err: any) {
        console.error(err);
        alert(err.message || 'Registration failed. Please check details and try again.');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    errors,
    setErrors,
    handleContinue,
    handleBack,
    handleUsernameChange,
    handleCardNumberChange,
    handleCardExpiryChange,
    handleCardCvvChange
  };
};
