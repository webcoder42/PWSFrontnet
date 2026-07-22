import LanguageSelection from '../components/profileSetup/languageSelection/languageSelection';
import NameDetails from '../components/profileSetup/nameDetails/nameDetails';
import ContactInfo from '../components/profileSetup/contactInfo/contactInfo';
import LocationDetails from '../components/profileSetup/locationDetails/locationDetails';
import DateOfBirth from '../components/profileSetup/dateOfBirth/dateOfBirth';
import GenderIdentity from '../components/profileSetup/genderIdentity/genderIdentity';
import PhysicalStats from '../components/profileSetup/physicalStats/physicalStats';
import EmergencyContact from '../components/profileSetup/emergencyContact/emergencyContact';
import CareNeeds from '../components/profileSetup/careNeeds/careNeeds';
import PaymentMethod from '../components/profileSetup/paymentMethod/paymentMethod';
import ProfileSidebar from '../components/profileSetup/profileSidebar/profileSidebar';
import MobileHeader from '../components/profileSetup/mobileHeader/mobileHeader';
import SetupHeader from '../components/profileSetup/setupHeader/setupHeader';
import SetupFooter from '../components/profileSetup/setupFooter/setupFooter';
import StepWrapper from '../components/profileSetup/stepWrapper/stepWrapper';

import { useState } from 'react';
import { useProfileState } from '../hooks/useProfileState';

const ProfileSetupPage = () => {
  const [phoneVerified, setPhoneVerified] = useState(false);
  const {
    currentStep,
    formData,
    setFormData,
    errors,
    showCvv,
    setShowCvv,
    handleUsernameChange,
    handleCardNumberChange,
    handleCardExpiryChange,
    handleCardCvvChange,
    handleContinue,
    handleBack
  } = useProfileState();

  return (
    <div className="flex min-h-screen w-full bg-surface-vibrant font-dm">
      <ProfileSidebar currentStep={currentStep} />

      <main className="flex-1 lg:ml-80 flex flex-col min-h-screen">
        <MobileHeader currentStep={currentStep} totalSteps={9} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 lg:p-24 flex flex-col items-center lg:items-start no-scrollbar">
          <div className="w-full max-w-4xl mx-auto">
            <SetupHeader />

            <StepWrapper step={1} currentStep={currentStep} isStep1>
              <LanguageSelection formData={formData} setFormData={setFormData} />
            </StepWrapper>

            <StepWrapper step={2} currentStep={currentStep}>
              <NameDetails
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                handleUsernameChange={handleUsernameChange}
              />
            </StepWrapper>

            <StepWrapper step={3} currentStep={currentStep}>
              <ContactInfo formData={formData} setFormData={setFormData} onPhoneVerifiedChange={setPhoneVerified} />
            </StepWrapper>

            <StepWrapper step={4} currentStep={currentStep}>
              <LocationDetails formData={formData} setFormData={setFormData} />
            </StepWrapper>

            <StepWrapper step={5} currentStep={currentStep}>
              <DateOfBirth formData={formData} setFormData={setFormData} />
            </StepWrapper>

            <StepWrapper step={6} currentStep={currentStep}>
              <GenderIdentity formData={formData} setFormData={setFormData} />
            </StepWrapper>

            <StepWrapper step={7} currentStep={currentStep}>
              <PhysicalStats formData={formData} setFormData={setFormData} />
            </StepWrapper>

            <StepWrapper step={8} currentStep={currentStep}>
              <EmergencyContact formData={formData} setFormData={setFormData} />
            </StepWrapper>

            <StepWrapper step={9} currentStep={currentStep}>
              <CareNeeds formData={formData} setFormData={setFormData} />
            </StepWrapper>
          </div>
        </div>

        <SetupFooter
          currentStep={currentStep}
          totalSteps={9}
          handleBack={handleBack}
          handleContinue={handleContinue}
          errors={errors}
          phoneVerified={phoneVerified}
          phoneStep={3}
        />
      </main>
    </div>
  );
};

export default ProfileSetupPage;
