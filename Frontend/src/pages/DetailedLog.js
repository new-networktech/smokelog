// src/pages/DetailedLog.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/DetailedLog.css";

const API_URL = process.env.REACT_APP_API_URL;

function DetailedLog() {
  const [logs, setLogs] = useState([]);
  const [timeFilter, setTimeFilter] = useState("lastDay");
  const [summary, setSummary] = useState(0);

  // Fetch logs based on time filter
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_URL}/api/logs?filter=${timeFilter}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLogs(response.data.logs);
        setSummary(response.data.total);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };
    fetchLogs();
  }, [timeFilter]);

  // Change filter handler
  const handleFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  return (
    <div className="detailed-log-container">
      <h2>Detailed Smoking Log</h2>

      {/* Filter Section */}
      <div className="filter-container">
        <label htmlFor="time-filter">Show logs for:</label>
        <select
          id="time-filter"
          value={timeFilter}
          onChange={handleFilterChange}
        >
          <option value="lastDay">Last Day</option>
          <option value="lastWeek">Last Week</option>
          <option value="lastMonth">Last Month</option>
          <option value="lastYear">Last Year</option>
        </select>
      </div>

      {/* Summary Section */}
      <div className="summary-box">
        <h3>Summary</h3>
        <p>Total Cigarettes Smoked: {summary}</p>
      </div>

      {/* Logs Table */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Cigarettes Smoked</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => {
            const logDate = new Date(log.date);
            return (
              <tr key={index}>
                <td>{logDate.toLocaleDateString()}</td>
                <td>{logDate.toLocaleTimeString()}</td>
                <td>{log.quantity}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DetailedLog;
