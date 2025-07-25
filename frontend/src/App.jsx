import React, { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Incidents from "./pages/Incidents/Incidents";
import MyIncidents from "./pages/MyIncidents/MyIncidents";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import ReportIncident from "./components/ReportIncident/ReportIncident";
import UserManagement from "./pages/UserManagement/UserManagement";
import Auth from "./components/Auth/Auth";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import LandingPage from "./pages/LandingPage/LandingPage";
import IncidentMap from "./pages/Map/IncidentMap";
import IncidentDetail from "./components/IncidentDetail/IncidentDetail";
import apiService from "./services/apiService";
import "./App.css";

// This is the main component that renders when a user is logged in.
function AppContent() {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();

  // --- STATE MANAGEMENT ---
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("home");
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal States
  const [showReportForm, setShowReportForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // --- DATA FETCHING ---
  const loadIncidents = async () => {
    if (!apiService.auth.isAuthenticated()) {
      setIncidents([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await apiService.incidents.getAll();
      setIncidents(data);
    } catch (err) {
      setError("Erreur lors du chargement des incidents.");
      console.error("Erreur chargement incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load incidents on initial mount and when the user logs in/out
  useEffect(() => {
    loadIncidents();
  }, [isAuthenticated]);

  // --- EVENT HANDLERS ---
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleReportSuccess = () => {
    setShowReportForm(false);
    loadIncidents(); // Reload incidents to show the new one
  };

  const handleReportClick = () => {
    if (isAuthenticated) {
      setShowReportForm(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogout = () => {
    logout();
    setActiveView("home"); // Go to landing page after logout
  };

  const handleViewDetails = (incident) => {
    setSelectedIncident(incident);
  };

  // --- DERIVED STATE (STATS) ---
  const incidentStats = {
    total: incidents.length,
    pending: incidents.filter((i) => !i.is_approved && !i.rejection_reason)
      .length,
  };

  // --- RENDER LOGIC ---

  // Loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  // Show Landing Page if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className={`app ${darkMode ? "dark-mode" : ""}`}>
        <LandingPage onLoginClick={() => setShowAuthModal(true)} />
        {showAuthModal && (
          <Auth
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </div>
    );
  }

  // This function ensures only ONE view is rendered at a time.
  const renderActiveView = () => {
    switch (activeView) {
      case "home":
        return (
          <Home
            incidents={incidents}
            setActiveView={setActiveView}
            onReportClick={handleReportClick}
          />
        );
      case "dashboard":
        return <Dashboard incidents={incidents} />;
      case "incidents":
        return (
          <Incidents
            incidents={incidents}
            onViewDetails={handleViewDetails}
            loading={loading}
            error={error}
          />
        );
      case "my-incidents":
        return <MyIncidents onViewDetails={handleViewDetails} />;
      case "admin":
        if (user?.role === "admin" || user?.role === "superadmin")
          return <AdminPanel />;
        return (
          <Home
            incidents={incidents}
            setActiveView={setActiveView}
            onReportClick={handleReportClick}
          />
        );
      case "user-management":
        if (user?.role === "superadmin") return <UserManagement />;
        return (
          <Home
            incidents={incidents}
            setActiveView={setActiveView}
            onReportClick={handleReportClick}
          />
        );
      case "map":
        return (
          <IncidentMap
            incidents={incidents}
            onViewDetails={handleViewDetails}
          />
        );
      case "profile":
        return (
          <div className="profile-page">
            <h2>Mon Profil</h2>
            <div className="profile-card">
              <p>
                <strong>Nom:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Rôle:</strong>{" "}
                <span style={{ textTransform: "capitalize" }}>
                  {user?.role}
                </span>
              </p>
              <p>
                <strong>Membre depuis:</strong>{" "}
                {new Date(user?.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
        );
      default:
        return (
          <Home
            incidents={incidents}
            setActiveView={setActiveView}
            onReportClick={handleReportClick}
          />
        );
    }
  };

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onReportClick={handleReportClick}
        user={user}
        onLogout={handleLogout}
      />
      <div className="app-container">
        <Sidebar
          sidebarOpen={sidebarOpen}
          activeView={activeView}
          setActiveView={setActiveView}
          incidentStats={incidentStats}
          userRole={user?.role}
          isAuthenticated={isAuthenticated}
        />
        <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
          {renderActiveView()}
        </main>
      </div>

      {/* --- MODALS --- */}
      {showReportForm && (
        <ReportIncident
          onClose={() => setShowReportForm(false)}
          onSuccess={handleReportSuccess}
        />
      )}
      {selectedIncident && (
        <IncidentDetail
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
}

// The root component that provides the Auth context
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
