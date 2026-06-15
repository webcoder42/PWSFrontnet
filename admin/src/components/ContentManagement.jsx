import React, { useState } from 'react';
import ContentHeader from './content/ContentHeader';
import NotificationList from './content/NotificationList';
import ContentHub from './content/ContentHub';

const ContentManagement = () => {
  const [notifications] = useState([
    { id: 1, title: 'Welcome to PSW+', type: 'Onboarding', target: 'All Users', status: 'Active' },
    { id: 2, title: 'Holiday Schedule Update', type: 'Announcement', target: 'Clients', status: 'Scheduled' },
    { id: 3, title: 'New Certification Required', type: 'Compliance', target: 'PSWs', status: 'Draft' },
  ]);

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <ContentHeader />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <NotificationList notifications={notifications} />
        </div>
        <div className="lg:col-span-4 space-y-10">
          <ContentHub />
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
