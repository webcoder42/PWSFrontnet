const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const SOCKET_SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export const AUTH_TOKEN_KEY = 'auth_token';

export const readAuthToken = () => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

const parseApiResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

const getAuthHeaders = () => {
  const token = readAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const listChatConversationsAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });
  return parseApiResponse(response);
};

export const getChatConversationAPI = async (conversationKey) => {
  const response = await fetch(
    `${API_BASE_URL}/chat/conversations/${encodeURIComponent(conversationKey)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    },
  );
  return parseApiResponse(response);
};

export const sendChatMessageAPI = async (conversationKey, text) => {
  const response = await fetch(
    `${API_BASE_URL}/chat/conversations/${encodeURIComponent(conversationKey)}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ text }),
    },
  );
  return parseApiResponse(response);
};
