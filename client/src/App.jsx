import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import PatientDashboard from "./components/PatientDashboard";
import Appointments from "./components/Appointments";
import Reports from "./components/Reports";
import Messages from "./components/Messages";
import LearningHub from "./components/LearningHub";
import Settings from "./components/Settings";
import { getActiveTabFromPath, getNavigatePath } from "./utils/patientRoutes";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const onNavigate = (tab) => {
    navigate(getNavigatePath(tab));
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  return (
    <Layout activeTab={activeTab} onTabChange={onNavigate}>
      <Routes>
        <Route index element={<PatientDashboard onNavigate={onNavigate} />} />
        <Route path="appointments" element={<Appointments onNavigate={onNavigate} />} />
        <Route path="reports" element={<Reports onNavigate={onNavigate} />} />
        <Route path="messages" element={<Messages onNavigate={onNavigate} />} />
        <Route path="learning-hub" element={<LearningHub onNavigate={onNavigate} />} />
        <Route path="settings" element={<Settings onNavigate={onNavigate} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
