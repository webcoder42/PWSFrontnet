export const AUTH_TOKEN_KEY = 'admin_auth_token';
export const ADMIN_USER_KEY = 'admin_user';

export const readAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const persistAdminSession = (user, token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
};

export const readAdminUser = () => {
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearAdminSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
};
