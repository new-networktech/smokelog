import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Stats from './pages/Stats';
import CalendarView from './pages/CalendarView';
import DetailedLog from './pages/DetailedLog';
import ErrorBoundary from './components/ErrorBoundary';
import AnimatedShape from './components/AnimatedShape'; 
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <AnimatedShape /> {/* Keep any other background shapes as needed */}

        <nav>
          <Link to="/">Home</Link>
          <Link to="/stats">Stats</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/detailed-log">Detailed Log</Link>
        </nav>

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

export default App;
