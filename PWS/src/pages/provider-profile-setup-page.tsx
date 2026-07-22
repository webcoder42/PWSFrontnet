import ProviderLanguageSelection from '../components/profileSetup/providerLanguageSelection/providerLanguageSelection';
import ProviderPersonalInfo from '../components/profileSetup/providerPersonalInfo/providerPersonalInfo';
import ProviderContactInfo from '../components/profileSetup/providerContactInfo/providerContactInfo';
import ProviderLocationDetails from '../components/profileSetup/providerLocationDetails/providerLocationDetails';
import ProviderGenderDetails from '../components/profileSetup/providerGenderDetails/providerGenderDetails';
import ProviderCertificateDetails from '../components/profileSetup/providerCertificateDetails/providerCertificateDetails';
import ProviderBackcheckDetails from '../components/profileSetup/providerBackcheckDetails/providerBackcheckDetails';
import ProviderExperienceDetails from '../components/profileSetup/providerExperienceDetails/providerExperienceDetails';
import ProviderServicesDetails from '../components/profileSetup/providerServicesDetails/providerServicesDetails';
import ProviderAvailabilityDetails from '../components/profileSetup/providerAvailabilityDetails/providerAvailabilityDetails';
import ProviderCapabilitiesDetails from '../components/profileSetup/providerCapabilitiesDetails/providerCapabilitiesDetails';
import ProviderPayoutDetails from '../components/profileSetup/providerPayoutDetails/providerPayoutDetails';
import ProviderSidebar from '../components/profileSetup/providerSidebar/providerSidebar';
import MobileHeader from '../components/profileSetup/mobileHeader/mobileHeader';
import SetupHeader from '../components/profileSetup/setupHeader/setupHeader';
import SetupFooter from '../components/profileSetup/setupFooter/setupFooter';
import StepWrapper from '../components/profileSetup/stepWrapper/stepWrapper';

import { useState } from 'react';
import { useProviderProfileState } from '../hooks/useProviderProfileState';

const ProviderProfileSetupPage = () => {
  const [phoneVerified, setPhoneVerified] = useState(false);
  const {
    currentStep,
    formData,
    setFormData,
    errors,
    handleContinue,
    handleBack
  } = useProviderProfileState();

  const handleSkipPayout = () => handleContinue();

  return (
    <div className="flex min-h-screen w-full bg-surface-vibrant font-dm">
      <ProviderSidebar currentStep={currentStep} />

      <main className="flex-1 lg:ml-80 flex flex-col min-h-screen">
        <MobileHeader currentStep={currentStep} totalSteps={11} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 lg:p-24 flex flex-col items-center lg:items-start">
          <div className="w-full max-w-4xl mx-auto">
            <SetupHeader />

            <StepWrapper step={1} currentStep={currentStep} isStep1>
              <ProviderLanguageSelection formData={formData} setFormData={setFormData} />
            </StepWrapper>

            <StepWrapper step={2} currentStep={currentStep}>
              <ProviderPersonalInfo formData={formData} setFormData={setFormData} />
            </StepWrapper>

            <StepWrapper step={3} currentStep={currentStep}>
              <ProviderContactInfo formData={formData} setFormData={setFormData} onPhoneVerifiedChange={setPhoneVerified} />
            </StepWrapper>

            <StepWrapper step={4} currentStep={currentStep} noPadding>
              <ProviderLocationDetails formData={formData} setFormData={setFormData} />
            </StepWrapper>

            <StepWrapper step={5} currentStep={currentStep}>
              <ProviderGenderDetails formData={formData} setFormData={setFormData} />
            </StepWrapper>

            <StepWrapper step={6} currentStep={currentStep}>
              <ProviderCertificateDetails formData={formData} setFormData={setFormData} />
            </StepWrapper>

            <StepWrapper step={7} currentStep={currentStep}>
              <ProviderBackcheckDetails formData={formData} setFormData={setFormData} />
            </StepWrapper>

            <StepWrapper step={8} currentStep={currentStep}>
              <ProviderExperienceDetails formData={formData} setFormData={setFormData} />
            </StepWrapper>

            <StepWrapper step={9} currentStep={currentStep}>
              <ProviderServicesDetails formData={formData} setFormData={setFormData} />
            </StepWrapper>

            <StepWrapper step={10} currentStep={currentStep}>
              <ProviderAvailabilityDetails formData={formData} setFormData={setFormData} />
            </StepWrapper>

            <StepWrapper step={11} currentStep={currentStep}>
              <ProviderCapabilitiesDetails formData={formData} setFormData={setFormData} />
            </StepWrapper>
          </div>
        </div>

        <SetupFooter
          currentStep={currentStep}
          totalSteps={11}
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

export default ProviderProfileSetupPage;
