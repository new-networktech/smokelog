//smoke-monitoring-app\src\components\Header.js
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="nav-container">
        {user && (
          <>
            <span className="welcome-text">Welcome, {user.username}</span>
            <nav className="nav-links">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/stats"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Stats
              </NavLink>
              <NavLink
                to="/calendar"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Calendar
              </NavLink>
              <NavLink
                to="/detailed-log"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Detailed Log
              </NavLink>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
