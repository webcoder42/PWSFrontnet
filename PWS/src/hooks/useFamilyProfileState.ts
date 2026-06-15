import { useState } from 'react';
import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProfileFormData, ProfileErrors } from '../types/profile';
import { registerUserAPI, uploadImageAPI } from '../utils/api';
import { encryptData } from '../utils/security';

interface UseProfileStateReturn {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  formData: ProfileFormData;
  setFormData: Dispatch<SetStateAction<ProfileFormData>>;
  errors: ProfileErrors;
  setErrors: Dispatch<SetStateAction<ProfileErrors>>;
  showCvv: boolean;
  setShowCvv: Dispatch<SetStateAction<boolean>>;
  handleUsernameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCardNumberChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCardExpiryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCardCvvChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleContinue: () => void;
  handleBack: () => void;
}

export const useFamilyProfileState = (): UseProfileStateReturn => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCvv, setShowCvv] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    familyRelation: '',
    language: 'English',
    languageFlag: '🇺🇸',
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    countryCode: '+1',
    countryFlag: '🇨🇦',
    email: sessionStorage.getItem('signup_email') || '',
    smsNotifications: true,
    emailNotifications: false,
    streetAddress: '',
    postalCode: '',
    city: '',
    province: '',
    dobMonth: 'January',
    dobDay: '10',
    dobYear: '1974',
    gender: 'Male',
    pronouns: '',
    heightValue: 66,
    heightUnit: 'ft',
    weightValue: 160,
    weightUnit: 'lbs',
    emergencyName: '',
    emergencyRelation: 'Daughter',
    emergencyPhone: '',
    emergencyEmail: '',
    emergencyCountryCode: '+1',
    emergencyContacts: [],
    careConditions: [],
    careServices: [],
    paymentMethod: 'Stripe',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardCountry: 'Canada',
    cardPostal: '',
    profilePhoto: '',
    savedPaymentMethods: [],
    stripeEmail: ''
  });

  const [errors, setErrors] = useState<ProfileErrors>({
    username: ''
  });

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
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        const email = sessionStorage.getItem('signup_email') || formData.email;
        const password = sessionStorage.getItem('signup_password') || 'password123';
        const role = sessionStorage.getItem('signup_role') || 'looking_for_care';
        const careType = sessionStorage.getItem('signup_care_type') || 'family';

        if (!email) {
          alert('Email not found. Please sign up again.');
          navigate('/signup');
          return;
        }

        const monthIndex = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ].indexOf(formData.dobMonth) + 1;
        const dobMonthString = monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;
        const dobDayString = parseInt(formData.dobDay) < 10 ? `0${parseInt(formData.dobDay)}` : `${parseInt(formData.dobDay)}`;
        const dobString = `${formData.dobYear}-${dobMonthString}-${dobDayString}`;
        const dateOfBirth = new Date(dobString);

        const firstName = formData.firstName.trim() || 'Test';
        const lastName = formData.lastName.trim() || 'User';
        const phone = formData.phone.trim() ? `${formData.countryCode}${formData.phone.replace(/\D/g, '')}` : `${formData.countryCode}5550199`;
        const street = formData.streetAddress.trim() || '123 Care Street';
        const postalCode = formData.postalCode.trim() || 'M5V 2T6';
        const city = formData.city.trim() || 'Toronto';
        const province = formData.province.trim() || 'ON';

        let photoUrl = formData.profilePhoto || undefined;
        if (typeof photoUrl === 'string' && photoUrl.startsWith('data:image')) {
          const uploadRes = await uploadImageAPI(photoUrl, 'mypsw/profile-images');
          photoUrl = uploadRes?.data?.secureUrl || undefined;
        }

        const payload = {
          email,
          password,
          role,
          language: formData.language,
          firstName,
          lastName,
          username: formData.username || undefined,
          photoUrl,
          phone,
          notificationPreferences: {
            smsReminders: formData.smsNotifications,
            emailUpdates: formData.emailNotifications
          },
          address: {
            street,
            postalCode,
            city,
            province
          },
          dateOfBirth,
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
          recipientProfile: {
            careType,
            relationship: formData.familyRelation || undefined,
            emergencyContacts: formData.emergencyName ? [
              {
                name: formData.emergencyName,
                relationship: formData.emergencyRelation,
                phone: `${formData.emergencyCountryCode}${formData.emergencyPhone}`,
                email: formData.emergencyEmail || undefined
              }
            ] : [],
            careConditions: formData.careConditions,
            servicesNeeded: formData.careServices
          }
        };

        const res = await registerUserAPI(payload);

        // Store user session so the user is authenticated immediately
        if (res && res.data) {
          localStorage.setItem('user_session', encryptData({
            ...(res.data as Record<string, unknown>),
            token: res.token,
          }));
        }

        sessionStorage.removeItem('signup_email');
        sessionStorage.removeItem('signup_password');
        sessionStorage.removeItem('signup_role');
        sessionStorage.removeItem('signup_care_type');

        navigate('/setup-complete');
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
    showCvv,
    setShowCvv,
    handleUsernameChange,
    handleCardNumberChange,
    handleCardExpiryChange,
    handleCardCvvChange,
    handleContinue,
    handleBack
  };
};
