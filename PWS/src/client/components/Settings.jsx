import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';

const MainSettings = lazy(() => import('./settings/MainSettings'));
const SecurityView = lazy(() => import('./settings/SecurityView'));
const NotificationsView = lazy(() => import('./settings/NotificationsView'));
const LanguagesView = lazy(() => import('./settings/LanguagesView'));
const AddLanguageView = lazy(() => import('./settings/AddLanguageView'));
const AppUpdatesView = lazy(() => import('./settings/AppUpdatesView'));
const SwitchAccountsView = lazy(() => import('./settings/SwitchAccountsView'));
const DataView = lazy(() => import('./settings/DataView'));
const AboutView = lazy(() => import('./settings/AboutView'));
const BillingView = lazy(() => import('./settings/BillingView'));
const ProfileView = lazy(() => import('./settings/ProfileView'));
const PreferencesHub = lazy(() => import('./settings/PreferencesHub'));
const PrefAllergies = lazy(() => import('./settings/PrefAllergies'));
const PrefCareProvider = lazy(() => import('./settings/PrefCareProvider'));
const PrefPets = lazy(() => import('./settings/PrefPets'));
const PrefCareType = lazy(() => import('./settings/PrefCareType'));
const PrefCareServices = lazy(() => import('./settings/PrefCareServices'));
const PrefHomeEnv = lazy(() => import('./settings/PrefHomeEnv'));
const PrefEmergency = lazy(() => import('./settings/PrefEmergency'));
const PrefBioData = lazy(() => import('./settings/PrefBioData'));

const LazyLoad = ({ children }) => (
  <Suspense fallback={
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  }>
    {children}
  </Suspense>
);

const Settings = ({ onNavigate }) => {
  const location = useLocation();
  const [view, setView] = useState('main');

  useEffect(() => {
    if (location.state?.view) {
      setView(location.state.view);
    } else {
      const params = new URLSearchParams(location.search);
      const viewParam = params.get('view');
      if (viewParam) {
        setView(viewParam);
      }
    }
  }, [location]);

  return (
    <div className="h-full">
      {view === 'main' ? <LazyLoad><MainSettings setView={setView} /></LazyLoad> : 
       view === 'switch-accounts' ? <LazyLoad><SwitchAccountsView setView={setView} /></LazyLoad> :
       view === 'notifications' ? <LazyLoad><NotificationsView setView={setView} /></LazyLoad> :
       view === 'languages' ? <LazyLoad><LanguagesView setView={setView} /></LazyLoad> :
       view === 'add-language' ? <LazyLoad><AddLanguageView setView={setView} /></LazyLoad> :
       view === 'app-updates' ? <LazyLoad><AppUpdatesView setView={setView} /></LazyLoad> :
       view === 'billing' ? <LazyLoad><BillingView setView={setView} onNavigate={onNavigate} /></LazyLoad> :
       view === 'data' ? <LazyLoad><DataView setView={setView} /></LazyLoad> :
       view === 'about' ? <LazyLoad><AboutView setView={setView} /></LazyLoad> :
       view === 'profile' ? <LazyLoad><ProfileView setView={setView} /></LazyLoad> :
       view === 'preferences' ? <LazyLoad><PreferencesHub setView={setView} /></LazyLoad> :
       view === 'pref-allergies' ? <LazyLoad><PrefAllergies setView={setView} /></LazyLoad> :
       view === 'pref-care-provider' ? <LazyLoad><PrefCareProvider setView={setView} /></LazyLoad> :
       view === 'pref-pets' ? <LazyLoad><PrefPets setView={setView} /></LazyLoad> :
       view === 'pref-care-type' ? <LazyLoad><PrefCareType setView={setView} /></LazyLoad> :
       view === 'pref-care-services' ? <LazyLoad><PrefCareServices setView={setView} /></LazyLoad> :
       view === 'pref-home-env' ? <LazyLoad><PrefHomeEnv setView={setView} /></LazyLoad> :
       view === 'pref-emergency' ? <LazyLoad><PrefEmergency setView={setView} /></LazyLoad> :
       view === 'pref-bio-data' ? <LazyLoad><PrefBioData setView={setView} /></LazyLoad> :
       <LazyLoad><SecurityView view={view} setView={setView} /></LazyLoad>}
    </div>
  );
};

export default Settings;
