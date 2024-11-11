// smokelog/Frontend/src/pages/CalendarView.js
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CalendarView.css";
import axios from "axios";

function CalendarView() {
  const [eventsByDate, setEventsByDate] = useState({});

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Fetch all logs from the backend
        const response = await axios.get("http://localhost:5000/api/logs");
        const logs = response.data.logs;

        // Group logs by date
        const events = logs.reduce((acc, log) => {
          const date = new Date(log.date).toLocaleDateString();
          if (!acc[date]) acc[date] = 0;
          acc[date] += log.quantity;
          return acc;
        }, {});

        setEventsByDate(events);
      } catch (error) {
        console.error("Error fetching logs for CalendarView:", error);
      }
    };

    fetchLogs();
  }, []); // Empty dependency array ensures it runs only on mount

  // Function to display the number of cigarettes for each day
  const tileContent = ({ date, view }) => {
    const dateString = date.toLocaleDateString();
    return view === "month" && eventsByDate[dateString] ? (
      <p className="tile-content">{eventsByDate[dateString]} cigarettes</p>
    ) : null;
  };

  return (
    <div className="calendar-view-container">
      <div className="calendar-wrapper">
        <h2>Smoking Events Calendar</h2>
        <Calendar
          tileContent={tileContent}
          onClickDay={(date) =>
            alert(
              `Cigarettes smoked on ${date.toLocaleDateString()}: ${
                eventsByDate[date.toLocaleDateString()] || 0
              }`
            )
          }
        />
      </div>
    </div>
  );
}

export default CalendarView;
