// smokelog/Frontend/src/App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import CalendarView from "./pages/CalendarView";
import DetailedLog from "./pages/DetailedLog";
import Login from "./pages/Login"; // Import the Login component
import Register from "./pages/Register"; // Import the Register component
import ErrorBoundary from "./components/ErrorBoundary";
import AnimatedShape from "./components/AnimatedShape";
import { useAuth } from "./context/AuthContext"; // Import authentication context
import "./styles/App.css";
import "./styles/Responsive.css";

function App() {
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  if (!isClientReady) return <div>Loading...</div>;

  return (
    <Router>
      <div className="App">
        <AnimatedShape />
        <NavBar /> {/* Main navigation bar component */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/detailed-log" element={<DetailedLog />} />
          <Route path="/login" element={<Login />} />{" "}
          {/* Add route for Login */}
          <Route path="/register" element={<Register />} />{" "}
          {/* Add route for Register */}
          <Route
            path="/stats"
            element={
              <ErrorBoundary>
                <Stats />
              </ErrorBoundary>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

// Main navigation bar component
function NavBar() {
  const { user, logout } = useAuth(); // Access authentication state and logout function
  const location = useLocation();
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/stats", label: "Stats" },
    { path: "/calendar", label: "Calendar" },
    { path: "/detailed-log", label: "Detailed Log" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-links">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={location.pathname === link.path ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
        {/* Conditional links based on authentication state */}
        {user ? (
          <button onClick={logout} className="nav-button">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="nav-button">
              Login
            </Link>
            <Link to="/register" className="nav-button">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default App;
