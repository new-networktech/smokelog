// Path: Frontend/src/pages/Home.js
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
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
import { useAuth } from "../context/AuthContext"; // Import auth context for user token
import "../styles/Home.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

function Home() {
  const { user } = useAuth(); // Get user from auth context
  const [dailyTotal, setDailyTotal] = useState(0);
  const [goal, setGoalState] = useState(10);
  const [lastSmokeMessage, setLastSmokeMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to login page if not authenticated
    }
  }, [user, navigate]);

  const fetchDailyTotal = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${API_URL}/api/logs?filter=lastDay`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDailyTotal(response.data.total);
      updateLastSmokeTime(response.data.logs);
    } catch (error) {
      console.error("Error fetching daily total:", error);
      setDailyTotal(0);
      setLastSmokeMessage("Unable to fetch smoking events.");
    }
  }, [API_URL, user]);

  useEffect(() => {
    fetchDailyTotal();
    setGoalState(10);
  }, [fetchDailyTotal]);

  const handleLogEvent = async () => {
    if (!user) return;
    try {
      await axios.post(
        `${API_URL}/api/log`,
        { quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchDailyTotal();
    } catch (error) {
      console.error("Error adding log entry:", error);
    }
  };

  const handleRemoveEvent = async () => {
    if (!user) return;
    try {
      await axios.delete(`${API_URL}/api/log`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchDailyTotal();
    } catch (error) {
      console.error("Error removing log entry:", error);
    }
  };

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
      <header className="app-header">
        <h2 className="welcome-message">
          {user ? `Welcome, ${user.username}` : "Welcome, Guest"}
        </h2>
      </header>
      <h2 className="page-header">Smoking Log</h2>
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
