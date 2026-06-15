import { useState } from "react";
import Layout from "./components/Layout";
import AdminDashboard from "./components/AdminDashboard";
import Clients from "./components/Clients";
import Psws from "./components/Psws";
import Users from "./components/Users";
import Appointments from "./components/Appointments";
import Reports from "./components/Reports";
import Messages from "./components/Messages";
import LearningHub from "./components/LearningHub";
import Compliance from "./components/Compliance";
import Billing from "./components/Billing";
import Support from "./components/Support";
import ContentManagement from "./components/ContentManagement";
import Settings from "./components/Settings";
import "./App.css";
import { useUser } from "../context/UserContext";

function App() {
  const { clearUser } = useUser();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [settingsView, setSettingsView] = useState("main");

  const handleTabChange = (tab, subView = "main") => {
    setActiveTab(tab);
    if (tab === "Settings") {
      setSettingsView(subView);
    }
  };

  const handleLogout = () => {
    clearUser();
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <AdminDashboard onNavigate={setActiveTab} />;
      case "Clients":
        return <Clients onNavigate={setActiveTab} />;
      case "PSWs":
        return <Psws onNavigate={setActiveTab} />;
      case "Users":
        return <Users onNavigate={setActiveTab} />;
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
      case "Settings":
        return <Settings onNavigate={handleTabChange} initialView={settingsView} />;
      default:
        return <AdminDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
