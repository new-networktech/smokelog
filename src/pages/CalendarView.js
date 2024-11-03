import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/CalendarView.css';
import { getLogs } from '../utils/storage';

function CalendarView() {
  const [logs, setLogs] = useState([]);
  const [eventsByDate, setEventsByDate] = useState({});

  useEffect(() => {
    const logs = getLogs();
    setLogs(logs);

    // Group logs by date
    const events = logs.reduce((acc, log) => {
      const date = new Date(log.timestamp).toLocaleDateString();
      if (!acc[date]) acc[date] = 0;
      acc[date] += log.quantity;
      return acc;
    }, {});

    setEventsByDate(events);
  }, []);

  // Function to display the number of cigarettes for each day
  const tileContent = ({ date, view }) => {
    const dateString = date.toLocaleDateString();
    return view === 'month' && eventsByDate[dateString] ? (
      <p className="tile-content">{eventsByDate[dateString]} cigarettes</p>
    ) : null;
  };

  return (
    <div className="calendar-view-container">
      <h2>Smoking Events Calendar</h2>
      <Calendar
        tileContent={tileContent}
        onClickDay={(date) =>
          alert(`Cigarettes smoked on ${date.toLocaleDateString()}: ${eventsByDate[date.toLocaleDateString()] || 0}`)
        }
      />
    </div>
  );
}

export default CalendarView;
