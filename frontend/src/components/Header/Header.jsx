import React, { useState } from "react";
import {
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  AlertCircle,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import "./Header.css";

const Header = ({
  darkMode,
  setDarkMode,
  sidebarOpen,
  setSidebarOpen,
  appName,
  onReportClick,
  user,
  onLogout,
  onLoginClick,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="menu-button"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="header-title">{appName || "Gestion des Incidents"}</h1>
        </div>

        <div className="header-right">
          <button onClick={onReportClick} className="btn-report-header">
            <AlertCircle size={20} />
            <span className="hide-mobile">Signaler</span>
          </button>

          <button className="header-icon-button notification-button">
            <Bell size={20} />
            <span className="notification-badge"></span>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="header-icon-button"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="user-menu-container">
              <button
                className="user-profile"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar">
                  <User size={20} />
                </div>
                <span className="user-name hide-mobile">{user.name}</span>
                <ChevronDown size={16} className="hide-mobile" />
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <p className="dropdown-user-name">{user.name}</p>
                    <p className="dropdown-user-email">{user.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item">
                    <User size={16} />
                    <span>Mon profil</span>
                  </button>
                  <button className="dropdown-item">
                    <Bell size={16} />
                    <span>Notifications</span>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item text-danger"
                    onClick={onLogout}
                  >
                    <LogOut size={16} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={onLoginClick} className="btn-login">
              <User size={20} />
              <span className="hide-mobile">Connexion</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
