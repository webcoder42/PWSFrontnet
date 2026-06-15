import { Routes, Route, Outlet } from 'react-router-dom';

import LandingPage from './pages/landing-page-page';
import LoginPage from './pages/login-page';
import SignupPage from './pages/signup-page';
import OnboardingPage from './pages/onboarding-page';
import UserTypePage from './pages/user-type-page';
import AccountSetupPage from './pages/account-setup-page';
import ProfileSetupPage from './pages/profile-setup-page';
import FamilyProfileSetupPage from './pages/family-profile-setup-page';
import ProviderProfileSetupPage from './pages/provider-profile-setup-page';
import SetupCompletePage from './pages/setup-complete-page';

import DashboardPage from './pages/dashboard-page';
import CareRequestsPage from './pages/care-requests-page';
import AvailabilityPage from './pages/availability-page';
import ClientsPage from './pages/clients-page';
import MessagesPage from './pages/messages-page';

import SettingsPage from './pages/settings-page';
import SwitchAccountsPage from './pages/switch-accounts-page';
import ProfileSettingsPage from './pages/profile-settings-page';
import NotificationSettingsPage from './pages/notification-settings-page';
import BillingPaymentPage from './pages/billing-payment-page';
import PasswordSecurityPage from './pages/password-security-page';
import DataSettingsPage from './pages/data-settings-page';
import AboutSettingsPage from './pages/about-settings-page';

import PreferencesPage from './pages/preferences-page';
import ServiceAreaPage from './pages/service-area-page';
import CareExpertisePage from './pages/care-expertise-page';
import CareServicesPage from './pages/care-services-page';
import PatientGenderPreferencesPage from './pages/patient-gender-preferences-page';
import LanguageSettingsPage from './pages/language-settings-page';
import CertificationsQualificationsPage from './pages/certifications-qualifications-page';

import ProtectedRoute from './components/ProtectedRoute';

import AdminRouteShell from './components/AdminRouteShell';
// @ts-ignore
import PatientApp from './client/App.jsx';
import LearningHubPage from './pages/learning-hub-page';

function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Admin Protected Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminRouteShell />
        </ProtectedRoute>
      } />

      {/* Patient / Recipient Protected Routes */}
      <Route path="/patient/*" element={
        <ProtectedRoute allowedRoles={['looking_for_care']}>
          <PatientApp />
        </ProtectedRoute>
      } />

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
        <ProtectedRoute allowedRoles={['care_provider']}>
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
  );
}


export default App;
