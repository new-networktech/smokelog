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

const API_URL = process.env.REACT_APP_API_URL;

ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

function Home() {
  const { user } = useAuth();
  const [dailyTotal, setDailyTotal] = useState(0);
  const [goal, setGoalState] = useState(10);
  const [lastSmokeTime, setLastSmokeTime] = useState("No smoking record found");
  const navigate = useNavigate();

  const fetchDailyTotal = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/logs?filter=lastDay`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDailyTotal(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching daily total:", error);
    }
  }, []);

  const formatLastSmokeTime = (lastSmoke) => {
    if (!lastSmoke) return "No smoking record found";

    const now = new Date();
    const smokeTime = new Date(lastSmoke.createdAt);
    const diffInMinutes = Math.floor((now - smokeTime) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `Last smoke: ${diffInMinutes} minute${
        diffInMinutes !== 1 ? "s" : ""
      } ago`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `Last smoke: ${diffInHours} hour${
          diffInHours !== 1 ? "s" : ""
        } ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `Last smoke: ${diffInDays} day${
          diffInDays !== 1 ? "s" : ""
        } ago`;
      }
    }
  };

  const fetchLastSmoke = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/logs/last-smoke`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.lastSmoke) {
        setLastSmokeTime(formatLastSmokeTime(response.data.lastSmoke));
      }
    } catch (error) {
      console.error("Error fetching last smoke:", error);
    }
  }, []);

  const handleSmoke = useCallback(
    async (action) => {
      try {
        const token = localStorage.getItem("token");
        const logAction = action === "smoke" ? "add" : "remove";

        const response = await axios.post(
          `${API_URL}/api/logs`,
          { action: logAction },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          await fetchLastSmoke();
          await fetchDailyTotal();
        }
      } catch (error) {
        console.error("Error logging smoke:", error.response?.data || error);
      }
    },
    [fetchLastSmoke, fetchDailyTotal]
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchLastSmoke();
      fetchDailyTotal();
    }
  }, [user, navigate, fetchLastSmoke, fetchDailyTotal]);

  const percentage = Math.min((dailyTotal / goal) * 100, 100);

  return (
    <div className="fade-in home-container">
      <header className="app-header">
        <h2 className="welcome-message">
          {user ? `Welcome, ${user.username}` : "Welcome, Guest"}
        </h2>
      </header>
      <h2 className="page-header">Smoking Log</h2>
      <p className="last-smoke-message">{lastSmokeTime}</p>
      <div className="goal-input-container">
        <label htmlFor="dailyGoal">Set Daily Goal: </label>
        <input
          type="number"
          id="dailyGoal"
          min="1"
          value={goal}
          onChange={(e) => setGoalState(parseInt(e.target.value, 10) || 1)}
        />
      </div>
      <div className="stats-container">
        <div className="stat-item">
          <h3>Daily Total</h3>
          <p>{dailyTotal}</p>
        </div>
        <div className="stat-item">
          <h3>Goal Progress</h3>
          <p>{Math.round(percentage)}%</p>
        </div>
      </div>
      <div className="donut-chart-container">
        <div className="donut-chart">
          <Doughnut
            data={{
              labels: ["Progress", "Remaining"],
              datasets: [
                {
                  data: [dailyTotal, Math.max(goal - dailyTotal, 0)],
                  backgroundColor: [
                    percentage >= 90 ? "#FF5555" : "#FFA500",
                    "#D3D3D3",
                  ],
                  hoverBackgroundColor: [
                    percentage >= 90 ? "#FF8888" : "#FF8C00",
                    "#C0C0C0",
                  ],
                },
              ],
            }}
            options={{
              cutout: "70%",
              plugins: {
                tooltip: { enabled: false },
                legend: { display: false },
              },
            }}
          />
          <div className="chart-center-text">{Math.round(percentage)}%</div>
        </div>
      </div>
      <div className="button-container">
        <button
          className="action-button add"
          onClick={() => handleSmoke("smoke")}
        >
          + Smoke
        </button>
        <button
          className="action-button remove"
          onClick={() => handleSmoke("unsmoke")}
        >
          - Smoke
        </button>
      </div>
    </div>
  );
}

export default Home;
