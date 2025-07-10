import React from "react";
import { Home, BarChart3, AlertCircle, Settings, Users } from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({ sidebarOpen, activeView, setActiveView, incidentCount }) => {
  const menuItems = [
    {
      id: "home",
      label: "Accueil",
      icon: <Home size={20} />,
    },
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: <BarChart3 size={20} />,
    },
    {
      id: "incidents",
      label: "Incidents",
      icon: <AlertCircle size={20} />,
      badge: incidentCount,
    },
    {
      id: "users",
      label: "Utilisateurs",
      icon: <Users size={20} />,
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`sidebar-item ${activeView === item.id ? "active" : ""}`}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            <span className="sidebar-item-label">{item.label}</span>
            {item.badge && (
              <span className="sidebar-item-badge">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
