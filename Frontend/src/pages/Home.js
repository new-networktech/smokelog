// smokelog/Frontend/src/pages/Home.js
import React, { useEffect, useState, useCallback } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import "../styles/Home.css";

// Use the environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; // Fallback to localhost if not defined

ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

function Home() {
  const [dailyTotal, setDailyTotal] = useState(0);
  const [goal, setGoalState] = useState(10);
  const [lastSmokeMessage, setLastSmokeMessage] = useState("");

  // Wrap fetchDailyTotal in useCallback to memoize it
  const fetchDailyTotal = useCallback(async () => {
    console.log("API_URL:", API_URL); // Check if the API URL is defined correctly
    try {
      const response = await axios.get(`${API_URL}/api/logs?filter=lastDay`);
      if (response && response.data && Array.isArray(response.data.logs)) {
        setDailyTotal(response.data.total || 0); // Set default total to 0 if undefined
        updateLastSmokeTime(response.data.logs);
      } else {
        console.error("Unexpected response structure", response);
        setDailyTotal(0); // Default to 0 if response structure is unexpected
        setLastSmokeMessage("No smoking events logged yet."); // Default message
      }
    } catch (error) {
      console.error("Error fetching daily total:", error);
      setDailyTotal(0); // Default to 0 in case of an error
      setLastSmokeMessage("Unable to fetch smoking events.");
    }
  }, [API_URL]);

  // Fetch the daily total on component mount
  useEffect(() => {
    fetchDailyTotal();
    setGoalState(10); // Default goal or fetch goal from backend if applicable
  }, [fetchDailyTotal]);

  // Add log event
  const handleLogEvent = async () => {
    try {
      await axios.post(`${API_URL}/api/log`, { quantity: 1 });
      fetchDailyTotal(); // Refresh daily total
    } catch (error) {
      console.error("Error adding log entry:", error);
    }
  };

  // Remove log event
  const handleRemoveEvent = async () => {
    try {
      await axios.delete(`${API_URL}/api/log`);
      fetchDailyTotal(); // Refresh daily total
    } catch (error) {
      console.error("Error removing log entry:", error);
    }
  };

  // Update the last smoke time message
  const updateLastSmokeTime = (logs) => {
    if (!logs || logs.length === 0) {
      setLastSmokeMessage("No smoking events logged yet.");
      return;
    }

    const lastLogTime = new Date(logs[logs.length - 1].date);
    const now = new Date();
    const diffMinutes = Math.floor((now - lastLogTime) / 60000);

    if (diffMinutes < 60) {
      setLastSmokeMessage(`Last smoke was ${diffMinutes} minute(s) ago.`);
    } else if (diffMinutes < 1440) {
      const diffHours = Math.floor(diffMinutes / 60);
      const remainingMinutes = diffMinutes % 60;
      setLastSmokeMessage(
        `Last smoke was ${diffHours} hour(s) and ${remainingMinutes} minute(s) ago.`
      );
    } else {
      const diffDays = Math.floor(diffMinutes / 1440);
      setLastSmokeMessage(`Last smoke was ${diffDays} day(s) ago.`);
    }
  };

  const percentage = Math.min((dailyTotal / goal) * 100, 100);
  const chartData = {
    labels: ["Progress", "Remaining"],
    datasets: [
      {
        data: [dailyTotal, Math.max(goal - dailyTotal, 0)],
        backgroundColor: [percentage >= 90 ? "#FF5555" : "#FFA500", "#D3D3D3"],
        hoverBackgroundColor: [
          percentage >= 90 ? "#FF8888" : "#FF8C00",
          "#C0C0C0",
        ],
      },
    ],
  };

  return (
    <div className="fade-in home-container">
      <h2 className="page-header">Your Smoking Log</h2>

      <p className="last-smoke-message">{lastSmokeMessage}</p>

      <div className="goal-input-container">
        <label htmlFor="dailyGoal">Set Daily Goal:</label>
        <input
          type="number"
          id="dailyGoal"
          min="1"
          value={goal}
          onChange={(e) => setGoalState(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="right-section">
        <div className="donut-chart">
          <Doughnut
            data={chartData}
            options={{
              cutout: "70%",
              plugins: {
                tooltip: { enabled: false },
                legend: { display: false },
              },
            }}
          />
          <p className="chart-label">{Math.round(percentage)}%</p>
        </div>

        <div className="log-controls">
          <div className="log-circle add-smoke" onClick={handleLogEvent}>
            <p>+ Smoke</p>
          </div>
          <div className="log-circle remove-smoke" onClick={handleRemoveEvent}>
            <p>- Smoke</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
