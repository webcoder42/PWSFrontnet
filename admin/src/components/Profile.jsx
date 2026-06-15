import React from 'react';
import { useAdmin } from '../context/AdminContext';
import ProfileView from './settings/ProfileView';
import { readAdminUser } from '../utils/sessionStorage';

const Profile = ({ adminUser }) => {
  const { clients, appointments, psws } = useAdmin();
  const storedUser = readAdminUser();
  const user = adminUser || storedUser || {};

  const activeClients = clients.filter((client) => client.status === 'Active').length;
  const activeBookings = appointments.filter((app) => ['confirmed', 'pending', 'scheduled', 'in-progress'].includes(app.status)).length;
  const upcomingSessions = appointments.filter((app) => {
    const dateString = app.appointmentDate || app.date;
    if (!dateString) return false;
    const date = new Date(dateString);
    return date >= new Date();
  }).length;

  return (
    <div className="h-full">
      <ProfileView
        adminUser={user}
        activeClients={activeClients}
        activeBookings={activeBookings}
        totalUsers={clients.length}
        totalPsws={psws.length}
        upcomingSessions={upcomingSessions}
      />
    </div>
  );
};

export default Profile;
