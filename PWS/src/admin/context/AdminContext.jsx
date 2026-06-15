import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchAdminClientsAPI,
  fetchAdminPswsAPI,
  fetchAdminAdminsAPI,
  fetchAdminAppointmentsAPI,
  fetchAdminStatsAPI,
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

export const AdminProvider = ({ children, isAuthenticated = false }) => {
  const [clients, setClients] = useState([]);
  const [psws, setPsws] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [complianceData, setComplianceData] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const refreshData = useCallback(async () => {
    if (!readAuthToken()) return;

    setLoading(true);
    setError(null);
    try {
      const [clientsRes, pswsRes, adminsRes, appointmentsRes, statsRes] = await Promise.all([
        fetchAdminClientsAPI(),
        fetchAdminPswsAPI(),
        fetchAdminAdminsAPI(),
        fetchAdminAppointmentsAPI(),
        fetchAdminStatsAPI(),
      ]);

      setClients((clientsRes.data || []).map((client) => ({ ...client, role: 'Client' })));
      setPsws((pswsRes.data || []).map((psw) => ({ ...psw, role: 'PSW' })));
      setAdmins((adminsRes.data || []).map((admin) => ({ ...admin, role: 'Admin' })));
      setAppointments(appointmentsRes.data || []);
      setStats(statsRes.data || null);
    } catch (err) {
      setError(err.message || 'Failed to load admin data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const shouldFetch = isAuthenticated || !!readAuthToken();
    if (shouldFetch) {
      refreshData();
    } else {
      setClients([]);
      setPsws([]);
      setAppointments([]);
      setStats(null);
    }
  }, [isAuthenticated, refreshData]);

  const addClient = (client) => {
    setClients([...clients, { ...client, id: Date.now(), sessions: 0, seed: client.name?.split(' ')[0] }]);
  };

  const deleteClient = (id) => setClients(clients.filter((c) => c.id !== id));

  const onboardPsw = (psw) => {
    setPsws([...psws, { ...psw, id: Date.now(), status: 'Available', rating: 5.0, seed: psw.name?.split(' ')[0] }]);
  };

  const addAppointment = async (app) => {
    const client = clients.find((c) => c.name === app.client || c.id === app.clientId);
    const psw = psws.find((p) => p.name === app.psw || p.id === app.pswId);

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
        await refreshData();
        return;
      } catch (err) {
        console.error('Failed to create appointment:', err);
      }
    }

    setAppointments([...appointments, { ...app, id: Date.now() }]);
  };

  const updateUser = (userId, updates) => {
    setClients((prev) => prev.map((user) => (user.id === userId ? { ...user, ...updates } : user)));
    setPsws((prev) => prev.map((user) => (user.id === userId ? { ...user, ...updates } : user)));
    setAdmins((prev) => prev.map((user) => (user.id === userId ? { ...user, ...updates } : user)));
  };

  const resolveTicket = (id) => setTickets(tickets.map((t) => (t.id === id ? { ...t, status: 'Resolved' } : t)));
  const addCourse = (course) => setCourses([...courses, { ...course, id: Date.now(), progress: 0 }]);
  const updateCourse = (id, updated) => setCourses(courses.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  const addNotification = (notif) => setNotifications([...notifications, { ...notif, id: Date.now() }]);

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
    clients, psws, admins, appointments, stats, dashboardStats,
    complianceData, invoices, tickets, courses, notifications,
    loading, error, refreshData,
    addClient, deleteClient, onboardPsw, addAppointment,
    updateUser,
    resolveTicket, addCourse, updateCourse, addNotification,
    setComplianceData, setInvoices,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
