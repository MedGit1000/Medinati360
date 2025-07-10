import React from "react";
import { Menu, X, Sun, Moon, Bell } from "lucide-react";
import "./Header.css";

const Header = ({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }) => {
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
          <h1 className="header-title">Gestion des Incidents</h1>
        </div>

        <div className="header-right">
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

          <div className="user-profile">
            <div className="user-avatar"></div>
            <span className="user-name">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
