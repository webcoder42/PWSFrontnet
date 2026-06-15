import { useUser } from '../context/UserContext';
import { readAuthToken } from '../utils/sessionStorage';
// @ts-ignore
import { AdminProvider } from '../admin/context/AdminContext.jsx';
// @ts-ignore
import AdminApp from '../admin/App.jsx';

export default function AdminRouteShell() {
  const { rawUser } = useUser();
  const isAuthenticated = !!readAuthToken() && rawUser?.role === 'admin';

  return (
    <AdminProvider isAuthenticated={isAuthenticated}>
      <AdminApp />
    </AdminProvider>
  );
}
