import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AdminProvider } from './context/AdminContext'
import { UserProvider, useUser } from '../context/UserContext.tsx'
import './index.css'

const AdminShell = () => {
  const { isAuthenticated } = useUser();

  return (
    <AdminProvider isAuthenticated={isAuthenticated}>
      <App />
    </AdminProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <AdminShell />
    </UserProvider>
  </React.StrictMode>,
)
