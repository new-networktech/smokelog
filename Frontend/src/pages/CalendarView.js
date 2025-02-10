// smokelog/Frontend/src/pages/CalendarView.js
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CalendarView.css";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

function CalendarView() {
  const [eventsByDate, setEventsByDate] = useState({});

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/logs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
  }, []); // Remove API_URL from dependencies

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
