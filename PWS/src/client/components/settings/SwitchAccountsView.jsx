import React from 'react';
import Breadcrumb from './Breadcrumb';
import SwitchAccountsPanel from '../../../components/settings/SwitchAccountsPanel';

const SwitchAccountsView = ({ setView }) => (
  <div className="animate-fade-in max-w-4xl mx-auto pb-20 px-4 sm:px-0">
    <Breadcrumb current="Switch Accounts" setView={setView} />
    <p className="text-gray-500 text-sm mb-8 ml-1">
      Manage multiple profiles and switch between them seamlessly.
    </p>
    <SwitchAccountsPanel />
  </div>
);

export default SwitchAccountsView;
