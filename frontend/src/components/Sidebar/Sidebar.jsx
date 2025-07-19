import React from "react";
import {
  Home,
  BarChart3,
  AlertCircle,
  Settings,
  Users,
  Shield,
  FileText,
  Map,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({
  sidebarOpen,
  activeView,
  setActiveView,
  incidentStats,
  isAdmin,
  isAuthenticated,
}) => {
  const menuItems = [
    {
      id: "home",
      label: "Accueil",
      icon: <Home size={20} />,
      showAlways: true,
    },
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: <BarChart3 size={20} />,
      showAlways: true,
    },
    {
      id: "incidents",
      label: "Incidents",
      icon: <AlertCircle size={20} />,
      badge: incidentStats?.total || 0,
      showAlways: true,
    },
    {
      id: "my-incidents",
      label: "Mes signalements",
      icon: <FileText size={20} />,
      showForAuth: true,
    },
    {
      id: "admin",
      label: "Administration",
      icon: <Shield size={20} />,
      badge: incidentStats?.pending || 0,
      showForAdmin: true,
      badgeType: "warning",
    },
    {
      id: "map",
      label: "Carte",
      icon: <Map size={20} />,
      showAlways: true,
    },
    {
      id: "users",
      label: "Utilisateurs",
      icon: <Users size={20} />,
      showForAdmin: true,
    },
    {
      id: "profile",
      label: "Profil",
      icon: <Users size={20} />,
      showForAuth: true,
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: <Settings size={20} />,
      showAlways: true,
    },
  ];

  // Debug log
  console.log("Sidebar props:", { isAdmin, isAuthenticated });

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter((item) => {
    if (item.showAlways) return true;
    if (item.showForAdmin && isAdmin === true) return true;
    if (item.showForAuth && isAuthenticated === true) return true;
    return false;
  });

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <nav className="sidebar-nav">
        {visibleMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`sidebar-item ${activeView === item.id ? "active" : ""}`}
            title={!sidebarOpen ? item.label : undefined}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            {sidebarOpen && (
              <>
                <span className="sidebar-item-label">{item.label}</span>
                {item.badge > 0 && (
                  <span
                    className={`sidebar-item-badge ${item.badgeType || ""}`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
