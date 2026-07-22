import React, { createContext, useContext, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchAdminClientsAPI,
  fetchAdminPswsAPI,
  fetchAdminAdminsAPI,
  fetchAdminAppointmentsAPI,
  fetchAdminStatsAPI,
  fetchAdminOverviewAPI,
  fetchAdminBillingAPI,
  createAdminAppointmentAPI,
} from '../../utils/adminApi';
import { readAuthToken } from '../../utils/sessionStorage';

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

const Q = {
  clients: ['admin', 'clients'],
  psws: ['admin', 'psws'],
  admins: ['admin', 'admins'],
  appointments: ['admin', 'appointments'],
  stats: ['admin', 'stats'],
  overview: ['admin', 'overview'],
  invoices: ['admin', 'invoices'],
};

export const AdminProvider = ({ children, isAuthenticated = false }) => {
  const queryClient = useQueryClient();
  const hasAuth = isAuthenticated || !!readAuthToken();
  const opts = { enabled: hasAuth };

  const clientsQuery = useQuery({
    queryKey: Q.clients,
    queryFn: () => fetchAdminClientsAPI().then(r => (r.data || []).map(c => ({ ...c, role: 'Client' }))),
    ...opts,
  });

  const pswsQuery = useQuery({
    queryKey: Q.psws,
    queryFn: () => fetchAdminPswsAPI().then(r => (r.data || []).map(p => ({ ...p, role: 'PSW' }))),
    ...opts,
  });

  const adminsQuery = useQuery({
    queryKey: Q.admins,
    queryFn: () => fetchAdminAdminsAPI().then(r => (r.data || []).map(a => ({ ...a, role: 'Admin' }))),
    ...opts,
  });

  const appointmentsQuery = useQuery({
    queryKey: Q.appointments,
    queryFn: () => fetchAdminAppointmentsAPI().then(r => r.data || []),
    ...opts,
  });

  const statsQuery = useQuery({
    queryKey: Q.stats,
    queryFn: () => fetchAdminStatsAPI().then(r => r.data || null),
    ...opts,
  });

  const overviewQuery = useQuery({
    queryKey: Q.overview,
    queryFn: () => fetchAdminOverviewAPI().then(r => r.data || null),
    ...opts,
  });

  const invoicesQuery = useQuery({
    queryKey: Q.invoices,
    queryFn: () => fetchAdminBillingAPI().then(r => r.data || []),
    ...opts,
  });

  const clients = clientsQuery.data ?? [];
  const psws = pswsQuery.data ?? [];
  const admins = adminsQuery.data ?? [];
  const appointments = appointmentsQuery.data ?? [];
  const stats = statsQuery.data ?? null;
  const overview = overviewQuery.data ?? null;
  const invoices = invoicesQuery.data ?? [];

  const loading = clientsQuery.isLoading || pswsQuery.isLoading || adminsQuery.isLoading ||
    appointmentsQuery.isLoading || statsQuery.isLoading || overviewQuery.isLoading ||
    invoicesQuery.isLoading;

  const error = clientsQuery.error || pswsQuery.error || adminsQuery.error ||
    appointmentsQuery.error || statsQuery.error || overviewQuery.error ||
    invoicesQuery.error;

  const refreshData = useCallback(() => {
    Object.values(Q).forEach(key => queryClient.invalidateQueries({ queryKey: key }));
  }, [queryClient]);

  const [complianceData, setComplianceData] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const setInvoices = useCallback((updater) => {
    queryClient.setQueryData(Q.invoices, (prev = []) =>
      typeof updater === 'function' ? updater(prev) : updater,
    );
  }, [queryClient]);

  const addClient = (client) => {
    queryClient.setQueryData(Q.clients, (prev = []) => [
      ...prev,
      { ...client, id: Date.now(), sessions: 0, seed: client.name?.split(' ')[0] },
    ]);
  };

  const deleteClient = (id) => {
    queryClient.setQueryData(Q.clients, (prev = []) =>
      prev.filter((c) => c.id !== id && c._id !== id),
    );
  };

  const onboardPsw = (psw) => {
    queryClient.setQueryData(Q.psws, (prev = []) => [
      ...prev,
      { ...psw, id: Date.now(), status: 'Available', rating: 5.0, seed: psw.name?.split(' ')[0] },
    ]);
  };

  const addAppointment = async (app) => {
    const client = clients.find((c) => c.name === app.client || c.id === app.clientId || c._id === app.clientId);
    const psw = psws.find((p) => p.name === app.psw || p.id === app.pswId || p._id === app.pswId);

    if (client?._id && psw?._id) {
      try {
        await createAdminAppointmentAPI({
          userId: client._id,
          pswId: psw._id,
          service: app.type || app.service || 'Personal Care',
          date: app.date,
          time: app.time,
          duration: app.duration || '1 hour',
          price: app.price ?? 0,
          location: app.location || 'Client home',
        });
        queryClient.invalidateQueries({ queryKey: Q.appointments });
        return;
      } catch (err) {
        console.error('Failed to create appointment:', err);
      }
    }

    queryClient.setQueryData(Q.appointments, (prev = []) => [...prev, { ...app, id: Date.now() }]);
  };

  const updateUser = (userId, updates) => {
    const update = (prev = []) => prev.map((user) =>
      (user.id === userId || user._id === userId) ? { ...user, ...updates } : user,
    );
    queryClient.setQueryData(Q.clients, update);
    queryClient.setQueryData(Q.psws, update);
    queryClient.setQueryData(Q.admins, update);
  };

  const resolveTicket = (id) => setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status: 'Resolved' } : t));
  const addCourse = (course) => setCourses((prev) => [...prev, { ...course, id: Date.now(), progress: 0 }]);
  const updateCourse = (id, updated) => setCourses((prev) => prev.map((c) => c.id === id ? { ...c, ...updated } : c));
  const addNotification = (notif) => setNotifications((prev) => [...prev, { ...notif, id: Date.now() }]);

  const dashboardStats = stats
    ? [
        { label: 'Total Clients', value: String(stats.totalClients ?? clients.length), sub: 'Registered patients', color: 'purple' },
        { label: 'Total PSWs', value: String(stats.totalPsws ?? psws.length), sub: 'Care providers on platform', color: 'rose' },
        { label: "Today's Sessions", value: String(stats.todaysSessions ?? appointments.filter(isToday).length), sub: 'Scheduled appointments today', color: 'emerald' },
      ]
    : [
        { label: 'Active Clients', value: clients.filter((c) => c.status === 'Active').length.toString(), sub: 'Registered patients', color: 'purple' },
        { label: 'Active PSWs', value: psws.filter((p) => p.status === 'On Shift').length.toString(), sub: 'On-duty support workers', color: 'rose' },
        { label: "Today's Sessions", value: appointments.filter(isToday).length.toString(), sub: 'Scheduled appointments today', color: 'emerald' },
      ];

  const value = {
    clients, psws, admins, appointments, stats, overview, dashboardStats,
    complianceData, invoices, tickets, courses, notifications,
    loading, error, refreshData,
    addClient, deleteClient, onboardPsw, addAppointment,
    updateUser,
    resolveTicket, addCourse, updateCourse, addNotification,
    setComplianceData, setInvoices,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
