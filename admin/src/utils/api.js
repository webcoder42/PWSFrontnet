import { clearAdminSession, readAuthToken } from './sessionStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const parseResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      clearAdminSession();
    }
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

const authHeaders = () => {
  const token = readAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginAdminAPI = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return parseResponse(response);
};

export const fetchAdminClientsAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/clients`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return parseResponse(response);
};

export const fetchAdminPswsAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/psws`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return parseResponse(response);
};

export const fetchAdminAppointmentsAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/appointments`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return parseResponse(response);
};

export const fetchAdminStatsAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return parseResponse(response);
};

export const fetchAdminComplianceAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/compliance`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return parseResponse(response);
};

export const fetchAdminBillingAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/billing`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return parseResponse(response);
};

export const fetchAdminSupportAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/support`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return parseResponse(response);
};

export const fetchAdminOverviewAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/overview`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return parseResponse(response);
};

export const createAppointmentAPI = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};
