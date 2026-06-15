import React, { useState } from 'react';
import MainSettings from './settings/MainSettings';
import SecurityView from './settings/SecurityView';
import NotificationsView from './settings/NotificationsView';
import LanguagesView from './settings/LanguagesView';
import AddLanguageView from './settings/AddLanguageView';
import AppUpdatesView from './settings/AppUpdatesView';
import SwitchAccountsView from './settings/SwitchAccountsView';
import DataView from './settings/DataView';
import AboutView from './settings/AboutView';
import BillingView from './settings/BillingView';
import ProfileView from './settings/ProfileView';
import PreferencesHub from './settings/PreferencesHub';
import PrefAllergies from './settings/PrefAllergies';
import PrefCareProvider from './settings/PrefCareProvider';
import PrefPets from './settings/PrefPets';
import PrefCareType from './settings/PrefCareType';
import PrefCareServices from './settings/PrefCareServices';
import PrefHomeEnv from './settings/PrefHomeEnv';
import PrefEmergency from './settings/PrefEmergency';
import PrefBioData from './settings/PrefBioData';

const Settings = () => {
  const [view, setView] = useState('main');

  return (
    <div className="h-full">
      {view === 'main' ? <MainSettings setView={setView} /> : 
       view === 'switch-accounts' ? <SwitchAccountsView setView={setView} /> :
       view === 'notifications' ? <NotificationsView setView={setView} /> :
       view === 'languages' ? <LanguagesView setView={setView} /> :
       view === 'add-language' ? <AddLanguageView setView={setView} /> :
       view === 'app-updates' ? <AppUpdatesView setView={setView} /> :
       view === 'billing' ? <BillingView setView={setView} /> :
       view === 'data' ? <DataView setView={setView} /> :
       view === 'about' ? <AboutView setView={setView} /> :
       view === 'profile' ? <ProfileView setView={setView} /> :
       view === 'preferences' ? <PreferencesHub setView={setView} /> :
       view === 'pref-allergies' ? <PrefAllergies setView={setView} /> :
       view === 'pref-care-provider' ? <PrefCareProvider setView={setView} /> :
       view === 'pref-pets' ? <PrefPets setView={setView} /> :
       view === 'pref-care-type' ? <PrefCareType setView={setView} /> :
       view === 'pref-care-services' ? <PrefCareServices setView={setView} /> :
       view === 'pref-home-env' ? <PrefHomeEnv setView={setView} /> :
       view === 'pref-emergency' ? <PrefEmergency setView={setView} /> :
       view === 'pref-bio-data' ? <PrefBioData setView={setView} /> :
       <SecurityView view={view} setView={setView} />}
    </div>
  );
};

export default Settings;
