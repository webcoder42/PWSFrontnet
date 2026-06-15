import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchAdminClientsAPI,
  fetchAdminPswsAPI,
  fetchAdminAppointmentsAPI,
  fetchAdminStatsAPI,
  fetchAdminComplianceAPI,
  fetchAdminBillingAPI,
  fetchAdminSupportAPI,
  fetchAdminOverviewAPI,
  createAppointmentAPI,
} from '../utils/api';
import { readAuthToken } from '../utils/sessionStorage';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

const isToday = (appointment) => {
  if (!appointment?.appointmentDate) {
    const todayIso = new Date().toISOString().split('T')[0];
    return appointment?.date === todayIso;
  }
  const d = new Date(appointment.appointmentDate);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

export const AdminProvider = ({ children, isAuthenticated = false }) => {
  const [clients, setClients] = useState([]);
  const [psws, setPsws] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [complianceData, setComplianceData] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [overview, setOverview] = useState(null);
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'PSW Onboarding Protocol',
      category: 'PSW Onboarding',
      duration: '25 min',
      lessons: 5,
      progress: 40,
      icon: 'document',
      curriculum: [
        { title: '1. PSW Registration & Verification', time: '10 mins', status: 'completed' },
        { title: '2. Assignment Workflow Setup', time: '15 mins', status: 'completed' },
        { title: '3. Client Matching Criteria', time: '12 mins', status: 'completed' },
        { title: '4. Scheduling & Shift Management', time: '8 mins', status: 'in-progress' },
        { title: '5. Performance Review Process', time: '20 mins', status: 'upcoming' },
      ],
      details: { duration: '25 Minutes', difficulty: 'Beginner', certification: 'PSWB Core Credit' },
      instructor: { name: 'Dr. Sarah Thompson', role: 'Chief Nursing Officer', seed: 'Sarah' },
      color: 'from-purple-600 to-indigo-700'
    }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to PSW+', type: 'Onboarding', target: 'All Users', status: 'Active' },
    { id: 2, title: 'Holiday Schedule Update', type: 'Announcement', target: 'Clients', status: 'Scheduled' },
  ]);

  const refreshData = useCallback(async () => {
    if (!readAuthToken()) return;

    setLoading(true);
    setError(null);
    try {
      const [clientsRes, pswsRes, appointmentsRes, statsRes, complianceRes, billingRes, supportRes, overviewRes] = await Promise.all([
        fetchAdminClientsAPI(),
        fetchAdminPswsAPI(),
        fetchAdminAppointmentsAPI(),
        fetchAdminStatsAPI(),
        fetchAdminComplianceAPI(),
        fetchAdminBillingAPI(),
        fetchAdminSupportAPI(),
        fetchAdminOverviewAPI(),
      ]);

      setClients(clientsRes.data || []);
      setPsws(pswsRes.data || []);
      setAppointments(appointmentsRes.data || []);
      setStats(statsRes.data || null);
      setComplianceData(complianceRes.data || []);
      setInvoices(billingRes.data || []);
      setTickets(supportRes.data || []);
      setOverview(overviewRes.data || null);
    } catch (err) {
      setError(err.message || 'Failed to load admin data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    } else {
      setClients([]);
      setPsws([]);
      setAppointments([]);
      setStats(null);
    }
  }, [isAuthenticated, refreshData]);

  const addClient = (client) => {
    setClients([...clients, { ...client, id: Date.now(), sessions: 0, seed: client.name.split(' ')[0] }]);
  };

  const deleteClient = (id) => setClients(clients.filter((c) => c.id !== id));

  const onboardPsw = (psw) => {
    setPsws([...psws, { ...psw, id: Date.now(), status: 'Available', rating: 5.0, seed: psw.name.split(' ')[0] }]);
  };

  const addAppointment = async (app) => {
    const client = clients.find((c) => c.name === app.client || c.id === app.clientId);
    const psw = psws.find((p) => p.name === app.psw || p.id === app.pswId);

    if (client?._id && psw?._id) {
      try {
        await createAppointmentAPI({
          userId: client._id,
          pswId: psw._id,
          service: app.type || app.service || 'Personal Care',
          date: app.date,
          time: app.time,
          duration: app.duration || '1 hour',
          price: app.price ?? 0,
          location: app.location || 'Client home',
        });
        await refreshData();
        return;
      } catch (err) {
        console.error('Failed to create appointment:', err);
      }
    }

    setAppointments([...appointments, { ...app, id: Date.now() }]);
  };

  const resolveTicket = (id) => setTickets(tickets.map((t) => (t.id === id ? { ...t, status: 'Resolved' } : t)));

  const addCourse = (course) => setCourses([...courses, { ...course, id: Date.now(), progress: 0 }]);
  const updateCourse = (id, updated) => setCourses(courses.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  const addNotification = (notif) => setNotifications([...notifications, { ...notif, id: Date.now() }]);

  const openBookings = appointments.filter((app) => ['confirmed', 'pending', 'scheduled', 'in-progress'].includes(app.status)).length;

  const dashboardStats = overview
    ? [
        {
          label: 'Total Users',
          value: String(overview.totalClients ?? clients.length),
          sub: 'Registered platform users',
          color: 'purple',
        },
        {
          label: 'Open Bookings',
          value: String(openBookings),
          sub: 'Active booking requests',
          color: 'rose',
        },
        {
          label: 'Active Clients',
          value: clients.filter((c) => c.status === 'Active').length.toString(),
          sub: 'Users currently active',
          color: 'emerald',
        },
        {
          label: "Today's Sessions",
          value: String(overview.completedAppointments ?? appointments.filter(isToday).length),
          sub: 'Scheduled appointments today',
          color: 'sky',
        },
      ]
    : stats
    ? [
        {
          label: 'Total Users',
          value: String(stats.totalClients ?? clients.length),
          sub: 'Registered platform users',
          color: 'purple',
        },
        {
          label: 'Open Bookings',
          value: String(openBookings),
          sub: 'Active booking requests',
          color: 'rose',
        },
        {
          label: 'Active Clients',
          value: clients.filter((c) => c.status === 'Active').length.toString(),
          sub: 'Users currently active',
          color: 'emerald',
        },
        {
          label: "Today's Sessions",
          value: String(stats.todaysSessions ?? appointments.filter(isToday).length),
          sub: 'Scheduled appointments today',
          color: 'sky',
        },
      ]
    : [
        {
          label: 'Active Clients',
          value: clients.filter((c) => c.status === 'Active').length.toString(),
          sub: 'Registered patients',
          color: 'purple',
        },
        {
          label: 'Open Bookings',
          value: String(openBookings),
          sub: 'Active booking requests',
          color: 'rose',
        },
        {
          label: 'Active PSWs',
          value: psws.filter((p) => p.status === 'On Shift').length.toString(),
          sub: 'On-duty support workers',
          color: 'emerald',
        },
        {
          label: "Today's Sessions",
          value: appointments.filter(isToday).length.toString(),
          sub: 'Scheduled appointments today',
          color: 'sky',
        },
      ];

  const value = {
    clients,
    psws,
    appointments,
    stats,
    overview,
    dashboardStats,
    complianceData,
    invoices,
    tickets,
    courses,
    notifications,
    loading,
    error,
    refreshData,
    addClient,
    deleteClient,
    onboardPsw,
    addAppointment,
    resolveTicket,
    addCourse,
    updateCourse,
    addNotification,
    setComplianceData,
    setInvoices,
    setTickets,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
