import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { clearStoredSession, readAuthToken } from '../utils/sessionStorage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { rawUser, isHydrated } = useUser();
  const location = useLocation();

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
      </div>
    );
  }

  const user = rawUser;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const token = user.token || readAuthToken();
  if (!token) {
    clearStoredSession();
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  try {
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = user.role ?? '';
      const isAllowed = allowedRoles.includes(userRole) || userRole === 'user';
      if (!isAllowed) {
        return <Navigate to="/" replace />;
      }
    }
  } catch {
    localStorage.removeItem('user_session');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
