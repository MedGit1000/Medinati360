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
import apiService from "./services/apiService";
import "./App.css";

// Composant principal qui utilise le contexte d'authentification
function AppContent() {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("home");
  const [showReportForm, setShowReportForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Charger les incidents au démarrage
  useEffect(() => {
    loadIncidents();
  }, []);

  // Recharger les incidents quand l'utilisateur change
  useEffect(() => {
    if (user !== undefined) {
      // user is loaded (either null or object)
      loadIncidents();
    }
  }, [user]);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      console.log("Loading incidents...");
      const data = await apiService.incidents.getAll();
      console.log("Raw API response:", data);
      setIncidents(data);
      console.log("Incidents set in state:", data.length);
    } catch (err) {
      setError("Erreur lors du chargement des incidents");
      console.error("Erreur chargement incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReportIncident = async (incidentData) => {
    try {
      // L'incident est créé via l'API dans ReportIncident
      // On recharge juste la liste
      await loadIncidents();
      setShowReportForm(false);
    } catch (err) {
      console.error("Erreur création incident:", err);
    }
  };

  const handleReportClick = () => {
    if (isAuthenticated) {
      setShowReportForm(true);
    } else {
      setShowAuthModal(true);
    }
  };

  // const handleAuthSuccess = () => {
  //   setShowAuthModal(false);
  //   // Recharger les incidents après connexion
  //   loadIncidents();
  //   // Ouvrir le formulaire de signalement après connexion réussie si nécessaire
  //   if (!user?.is_admin) {
  //     setShowReportForm(true);
  //   }
  // };
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    loadIncidents();
    // This check was using the old 'is_admin' property.
    // Now, we check if the user's role is 'user'.
    if (user?.role === "user") {
      setShowReportForm(true);
    }
  };

  const handleLogout = () => {
    logout();
    setActiveView("home");
    // Recharger les incidents (pour ne montrer que les approuvés)
    loadIncidents();
  };

  // Calculer les statistiques
  const incidentStats = {
    new: incidents.filter((i) => i.status === "Reçu").length,
    inProgress: incidents.filter(
      (i) => i.status === "En cours" || i.status === "Assigné"
    ).length,
    total: incidents.length,
    // Stats supplémentaires pour admin
    // pending: user?.is_admin
    //   ? incidents.filter((i) => !i.is_approved && !i.rejection_reason).length
    //   : 0,
    pending:
      user?.role === "admin" || user?.role === "superadmin"
        ? incidents.filter((i) => !i.is_approved && !i.rejection_reason).length
        : 0,
  };

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        appName="Medinati360"
        onReportClick={handleReportClick}
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setShowAuthModal(true)}
      />

      <div className="app-container">
        <Sidebar
          sidebarOpen={sidebarOpen}
          activeView={activeView}
          setActiveView={setActiveView}
          incidentStats={incidentStats}
          // isAdmin={user?.is_admin === true}
          userRole={user?.role}
          isAuthenticated={isAuthenticated}
        />

        <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
          {activeView === "home" && (
            <Home
              incidents={incidents}
              setActiveView={setActiveView}
              onReportClick={handleReportClick}
            />
          )}
          {activeView === "dashboard" && (
            <Dashboard
              incidents={incidents}
              setIncidents={setIncidents}
              onReportClick={handleReportClick}
              loading={loading}
              error={error}
            />
          )}
          {activeView === "incidents" && (
            <Incidents
              incidents={incidents}
              setIncidents={setIncidents}
              onReportClick={handleReportClick}
              loading={loading}
              error={error}
            />
          )}
          {activeView === "my-incidents" && isAuthenticated && <MyIncidents />}
          {/* {activeView === "admin" && user?.is_admin && <AdminPanel />} */}
          {activeView === "admin" &&
            (user?.role === "admin" || user?.role === "superadmin") && (
              <AdminPanel />
            )}
          {activeView === "user-management" && user?.role === "superadmin" && (
            <UserManagement />
          )}
          {activeView === "map" && (
            <div className="map-placeholder">
              <h2>Carte des incidents</h2>
              <p>Fonctionnalité bientôt disponible</p>
              <p className="text-secondary">
                Visualisez tous les incidents sur une carte interactive
              </p>
            </div>
          )}
          {activeView === "profile" && isAuthenticated && (
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
                  {user?.is_admin ? "Administrateur" : "Utilisateur"}
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
          )}
        </main>
      </div>

      {showReportForm && (
        <ReportIncident
          onClose={() => setShowReportForm(false)}
          onSuccess={handleReportIncident}
        />
      )}

      {showAuthModal && (
        <Auth
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

// Composant App principal avec le Provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
