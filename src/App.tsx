import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ReconciliationDashboard } from "./components/ReconciliationDashboard";
import { ReportsView } from "./components/ReportsView";
import { SettingsView } from "./components/SettingsView";

function App() {
  const [currentView, setCurrentView] = useState<"dashboard" | "reports" | "settings">("dashboard");

  return (
    <AuthProvider>
      <DashboardLayout currentView={currentView} onNavigate={setCurrentView}>
        {currentView === "dashboard" && <ReconciliationDashboard />}
        {currentView === "reports" && <ReportsView />}
        {currentView === "settings" && <SettingsView />}
      </DashboardLayout>
    </AuthProvider>
  );
}

export default App;
