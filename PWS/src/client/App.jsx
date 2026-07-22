import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import { getActiveTabFromPath, getNavigatePath } from "./utils/patientRoutes";
import "./App.css";

const PatientDashboard = lazy(() => import("./components/PatientDashboard"));
const Appointments = lazy(() => import("./components/Appointments"));
const Reports = lazy(() => import("./components/Reports"));
const Messages = lazy(() => import("./components/Messages"));
const LearningHub = lazy(() => import("./components/LearningHub"));
const Settings = lazy(() => import("./components/Settings"));

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const onNavigate = (tab, options = {}) => {
    navigate(getNavigatePath(tab, '/patient'), options);
  };

  const activeTab = getActiveTabFromPath(location.pathname, '/patient');

  return (
    <Layout activeTab={activeTab} onTabChange={onNavigate}>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <Routes>
          <Route index element={<PatientDashboard onNavigate={onNavigate} />} />
          <Route path="appointments" element={<Appointments onNavigate={onNavigate} />} />
          <Route path="reports" element={<Reports onNavigate={onNavigate} />} />
          <Route path="messages" element={<Messages onNavigate={onNavigate} />} />
          <Route path="learning-hub" element={<LearningHub onNavigate={onNavigate} />} />
          <Route path="settings" element={<Settings onNavigate={onNavigate} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
