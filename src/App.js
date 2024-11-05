import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Stats from './pages/Stats';
import CalendarView from './pages/CalendarView';
import DetailedLog from './pages/DetailedLog';
import ErrorBoundary from './components/ErrorBoundary';
import AnimatedShape from './components/AnimatedShape'; 
import './styles/App.css';
import './styles/Responsive.css';

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
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/detailed-log" element={<DetailedLog />} />
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

function NavBar() {
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
      </div>
    </nav>
  );
}

export default App;
