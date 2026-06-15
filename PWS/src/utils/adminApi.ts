import { readAuthToken } from './sessionStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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

export const createAdminAppointmentAPI = async (payload: Record<string, unknown>) => {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};
