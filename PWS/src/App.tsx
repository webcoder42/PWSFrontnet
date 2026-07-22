import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRouteShell from './components/AdminRouteShell';
import { UserProvider as ClientUserProvider } from './client/context/UserContext.jsx';
import { NotificationCenterProvider as ClientNotificationCenterProvider } from './client/context/NotificationCenterContext.jsx';

const LandingPage = lazy(() => import('./pages/landing-page-page'));
const LoginPage = lazy(() => import('./pages/login-page'));
const SignupPage = lazy(() => import('./pages/signup-page'));
const EmailVerificationPage = lazy(() => import('./pages/email-verification-page'));
const ForgotPasswordPage = lazy(() => import('./pages/forgot-password-page'));
const ResetPasswordPage = lazy(() => import('./pages/reset-password-page'));
const TwoFactorRecoveryPage = lazy(() => import('./pages/two-factor-recovery-page'));
const OnboardingPage = lazy(() => import('./pages/onboarding-page'));
const UserTypePage = lazy(() => import('./pages/user-type-page'));
const AccountSetupPage = lazy(() => import('./pages/account-setup-page'));
const ProfileSetupPage = lazy(() => import('./pages/profile-setup-page'));
const FamilyProfileSetupPage = lazy(() => import('./pages/family-profile-setup-page'));
const ProviderProfileSetupPage = lazy(() => import('./pages/provider-profile-setup-page'));
const SetupCompletePage = lazy(() => import('./pages/setup-complete-page'));

const DashboardPage = lazy(() => import('./pages/dashboard-page'));
const CareRequestsPage = lazy(() => import('./pages/care-requests-page'));
const AvailabilityPage = lazy(() => import('./pages/availability-page'));
const ClientsPage = lazy(() => import('./pages/clients-page'));
const MessagesPage = lazy(() => import('./pages/messages-page'));

const SettingsPage = lazy(() => import('./pages/settings-page'));
const SwitchAccountsPage = lazy(() => import('./pages/switch-accounts-page'));
const ProfileSettingsPage = lazy(() => import('./pages/profile-settings-page'));
const NotificationSettingsPage = lazy(() => import('./pages/notification-settings-page'));
const BillingPaymentPage = lazy(() => import('./pages/billing-payment-page'));
const PasswordSecurityPage = lazy(() => import('./pages/password-security-page'));
const DataSettingsPage = lazy(() => import('./pages/data-settings-page'));
const AboutSettingsPage = lazy(() => import('./pages/about-settings-page'));

const PreferencesPage = lazy(() => import('./pages/preferences-page'));
const ServiceAreaPage = lazy(() => import('./pages/service-area-page'));
const CareExpertisePage = lazy(() => import('./pages/care-expertise-page'));
const CareServicesPage = lazy(() => import('./pages/care-services-page'));
const PatientGenderPreferencesPage = lazy(() => import('./pages/patient-gender-preferences-page'));
const LanguageSettingsPage = lazy(() => import('./pages/language-settings-page'));
const CertificationsQualificationsPage = lazy(() => import('./pages/certifications-qualifications-page'));

const PatientApp = lazy(() => import('./client/App.jsx'));
const LearningHubPage = lazy(() => import('./pages/learning-hub-page'));
const PrivacyPolicy = lazy(() => import('./pages/privacy-policy-page'));
const TermsOfService = lazy(() => import('./pages/terms-of-service-page'));

function App() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/two-factor-recovery" element={<TwoFactorRecoveryPage />} />

      {/* Admin Protected Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminRouteShell />
        </ProtectedRoute>
      } />

      {/* Patient / Recipient Protected Routes */}
      <Route path="/patient/*" element={
        <ProtectedRoute allowedRoles={['looking_for_care', 'user']}>
          <ClientUserProvider>
            <ClientNotificationCenterProvider>
              <PatientApp />
            </ClientNotificationCenterProvider>
          </ClientUserProvider>
        </ProtectedRoute>
      } />

      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />

      {/* Onboarding Routes */}
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/user-type" element={<UserTypePage />} />
      <Route path="/account-setup" element={<AccountSetupPage />} />
      <Route path="/profile-setup" element={<ProfileSetupPage />} />
      <Route path="/family-profile-setup" element={<FamilyProfileSetupPage />} />
      <Route path="/provider-profile-setup" element={<ProviderProfileSetupPage />} />
      <Route path="/setup-complete" element={<SetupCompletePage />} />

      {/* Care Provider Protected Routes */}
      <Route element={
        <ProtectedRoute allowedRoles={['care_provider', 'user']}>
          <Outlet />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/care-requests" element={<CareRequestsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/learning-hub" element={<LearningHubPage />} />

        <Route path="/settings">
          <Route index element={<SettingsPage />} />
          <Route path="switch-accounts" element={<SwitchAccountsPage />} />
          <Route path="profile" element={<ProfileSettingsPage />} />
          <Route path="notifications" element={<NotificationSettingsPage />} />
          <Route path="billing" element={<BillingPaymentPage />} />
          <Route path="security" element={<PasswordSecurityPage />} />
          <Route path="data" element={<DataSettingsPage />} />
          <Route path="about" element={<AboutSettingsPage />} />

          <Route path="preferences">
            <Route index element={<PreferencesPage />} />
            <Route path="service-area" element={<ServiceAreaPage />} />
            <Route path="availability" element={<AvailabilityPage />} />
            <Route path="care-expertise" element={<CareExpertisePage />} />
            <Route path="care-services" element={<CareServicesPage />} />
            <Route path="patient-gender" element={<PatientGenderPreferencesPage />} />
            <Route path="language" element={<LanguageSettingsPage />} />
            <Route path="certifications" element={<CertificationsQualificationsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
    </Suspense>
  );
}

export default App;
