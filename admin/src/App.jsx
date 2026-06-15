import { useState, useEffect } from "react";
import { AdminProvider } from "./context/AdminContext";
import Layout from "./components/Layout";
import AdminDashboard from "./components/AdminDashboard";
import Clients from "./components/Clients";
import Psws from "./components/Psws";
import Appointments from "./components/Appointments";
import Reports from "./components/Reports";
import Messages from "./components/Messages";
import LearningHub from "./components/LearningHub";
import Compliance from "./components/Compliance";
import Billing from "./components/Billing";
import Support from "./components/Support";
import ContentManagement from "./components/ContentManagement";
import Profile from "./components/Profile";
import Login from "./components/Login";
import { readAuthToken, readAdminUser, clearAdminSession } from "./utils/sessionStorage";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!readAuthToken());
  const [adminUser, setAdminUser] = useState(() => readAdminUser());

  useEffect(() => {
    if (readAuthToken()) {
      setAdminUser(readAdminUser());
      setIsLoggedIn(true);
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    clearAdminSession();
    setIsLoggedIn(false);
    setAdminUser(null);
  };

  const handleLogin = (user) => {
    setAdminUser(user);
    setIsLoggedIn(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <AdminDashboard onNavigate={setActiveTab} />;
      case "Users":
        return <Clients onNavigate={setActiveTab} />;
      case "PSWs":
        return <Psws onNavigate={setActiveTab} />;
      case "Appointments":
        return <Appointments onNavigate={setActiveTab} />;
      case "Reports":
        return <Reports onNavigate={setActiveTab} />;
      case "Messages":
        return <Messages onNavigate={setActiveTab} />;
      case "Learning Hub":
        return <LearningHub onNavigate={setActiveTab} />;
      case "Compliance":
        return <Compliance onNavigate={setActiveTab} />;
      case "Billing":
        return <Billing onNavigate={setActiveTab} />;
      case "Support":
        return <Support onNavigate={setActiveTab} />;
      case "Content":
        return <ContentManagement onNavigate={setActiveTab} />;
      case "Profile":
        return <Profile adminUser={adminUser} />;
      default:
        return <AdminDashboard onNavigate={setActiveTab} />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <AdminProvider isAuthenticated={isLoggedIn}>
      <Layout
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        adminUser={adminUser}
      >
        {renderContent()}
      </Layout>
    </AdminProvider>
  );
}

export default App;
