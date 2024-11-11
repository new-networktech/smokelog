// smokelog/Frontend/src/pages/Stats.js
import React, { useEffect, useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import axios from "axios";
import "../styles/Stats.css";
const API_URL = process.env.REACT_APP_API_URL;


// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Stats() {
  const [dailyTotal, setDailyTotal] = useState(0);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [smokeFreeStreak, setSmokeFreeStreak] = useState(0);
  const [dailyAverage, setDailyAverage] = useState(0);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [monthlyAverage, setMonthlyAverage] = useState(0);
  const [goal, setGoal] = useState({ daily: 10, weekly: 70 });
  const [isChartVisible, setIsChartVisible] = useState(false); // Lazy load chart

  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch daily total
        const dailyResponse = await axios.get(
          `${API_URL}/api/logs?filter=lastDay`
        );
        setDailyTotal(dailyResponse.data.total);
        
        // Fetch weekly total
        const weeklyResponse = await axios.get(
          `${API_URL}/api/logs?filter=lastWeek`
        );
        setWeeklyTotal(weeklyResponse.data.total);

        // Fetch monthly total
        const monthlyResponse = await axios.get(
          `${API_URL}/api/logs?filter=lastMonth`
        );
        setMonthlyTotal(monthlyResponse.data.total);

        // Set averages
        setDailyAverage((dailyResponse.data.total / 1).toFixed(2));
        setWeeklyAverage((weeklyResponse.data.total / 7).toFixed(2));
        setMonthlyAverage((monthlyResponse.data.total / 30).toFixed(2));

        // Set smoke-free streak (this could be improved based on backend logic)
        // Placeholder for streak calculation
        setSmokeFreeStreak(0); // Calculate properly if needed

        // Set goals (fetch from backend if applicable, here set as default)
        setGoal({ daily: 10, weekly: 70 });
      } catch (error) {
        console.error("Error fetching data in Stats.js:", error);
      }
    };

    fetchData();

    // Delay the chart render to improve performance, especially on mobile devices
    const chartTimeout = setTimeout(() => setIsChartVisible(true), 500);
    return () => clearTimeout(chartTimeout);
  }, []);

  // Chart data
  const barData = useMemo(
    () => ({
      labels: ["Today", "This Week", "This Month (Avg)"],
      datasets: [
        {
          label: "Cigarettes Smoked",
          data: [dailyTotal, weeklyTotal, monthlyTotal / 30].map(
            (val) => val || 0
          ),
          backgroundColor: ["#FFA500", "#FFD700", "#808080"],
        },
      ],
    }),
    [dailyTotal, weeklyTotal, monthlyTotal]
  );

  // Chart options
  const barOptions = useMemo(() => {
    const maxTotal = Math.max(dailyTotal, weeklyTotal, monthlyTotal / 30);
    const yAxisMax = maxTotal > 10 ? maxTotal * 1.2 : 15;
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: yAxisMax,
          ticks: {
            stepSize: Math.ceil(yAxisMax / 5),
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    };
  }, [dailyTotal, weeklyTotal, monthlyTotal]);

  return (
    <div className="stats-dashboard">
      <h2 className="page-header">Smoking Dashboard</h2>
      <p>
        Smoke-Free Streak: <span className="highlight">{smokeFreeStreak}</span>{" "}
        days
      </p>

      {/* Stats grid container */}
      <div className="stats-grid">
        {/* Averages Section */}
        <div className="stats-section averages">
          <h3>Averages</h3>
          <p>
            Daily: <span className="highlight">{dailyAverage}</span> cigarettes
          </p>
          <p>
            Weekly: <span className="highlight">{weeklyAverage}</span>{" "}
            cigarettes
          </p>
          <p>
            Monthly: <span className="highlight">{monthlyAverage}</span>{" "}
            cigarettes
          </p>
        </div>

        {/* Goals Section */}
        <div className="stats-section goals">
          <h3>Goals</h3>
          <p>
            Daily Goal: <span className="highlight">{goal.daily}</span>{" "}
            cigarettes
          </p>
          <p>
            Weekly Goal: <span className="highlight">{goal.weekly}</span>{" "}
            cigarettes
          </p>
        </div>

        {/* Current Usage Section */}
        <div className="stats-section comparison-insights">
          <h3>Current Usage</h3>
          <p>
            This Week: <span className="highlight">{weeklyTotal}</span>{" "}
            cigarettes
          </p>
          <p>
            This Month: <span className="highlight">{monthlyTotal}</span>{" "}
            cigarettes
          </p>
        </div>
      </div>

      {/* Conditionally render chart based on isChartVisible */}
      {isChartVisible ? (
        <div className="chart-container">
          <h3>Daily, Weekly, Monthly Totals</h3>
          <div className="chart-scroll-container">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
}

export default Stats;
