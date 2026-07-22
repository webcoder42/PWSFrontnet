import { readAuthToken } from './sessionStorage';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.mypswplus.com/api';
const cleanUrl = rawBaseUrl.replace(/\/+$/, '');
const API_BASE_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

const parseResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

const authHeaders = (): Record<string, string> => {
  const token = readAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
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

export const fetchAdminAdminsAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/admins`, {
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

export const fetchAdminOverviewAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/overview`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return parseResponse(response);
};

export const fetchAdminConversationsAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/conversations`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return parseResponse(response);
};

export const fetchAdminConversationByKeyAPI = async (conversationKey: string) => {
  const response = await fetch(`${API_BASE_URL}/admin/conversations/${encodeURIComponent(conversationKey)}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return parseResponse(response);
};

export const fetchAdminExportReportAPI = async (reportKey: string, month?: string) => {
  const query = month ? `?month=${encodeURIComponent(month)}` : '';
  const response = await fetch(`${API_BASE_URL}/admin/export/${encodeURIComponent(reportKey)}${query}`, {
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

export const createAdminAppointmentAPI = async (payload: Record<string, unknown>) => {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

export const fetchAdminPswByIdAPI = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/admin/psws/${encodeURIComponent(id)}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return parseResponse(response);
};

export const fetchAdminBroadcastsAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/broadcasts`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return parseResponse(response);
};

export const sendAdminBroadcastAPI = async (payload: { target: string; subject: string; message: string }) => {
  const response = await fetch(`${API_BASE_URL}/admin/broadcast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

export const verifyAdminPswAPI = async (id: string, payload: { certificateStatus?: string; backgroundCheckStatus?: string; certificateId?: string; backgroundCheckId?: string }) => {
  const response = await fetch(`${API_BASE_URL}/admin/psws/${encodeURIComponent(id)}/verify`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};
