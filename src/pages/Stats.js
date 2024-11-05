import React, { useEffect, useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  getTotalForPeriod,
  getSmokeFreeStreak,
  calculateAverage,
  getGoal,
} from '../utils/storage';
import '../styles/Stats.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

function Stats() {
  const [dailyTotal, setDailyTotal] = useState(0);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [smokeFreeStreak, setSmokeFreeStreak] = useState(0);
  const [dailyAverage, setDailyAverage] = useState(0);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [monthlyAverage, setMonthlyAverage] = useState(0);
  const [goal, setGoal] = useState({ daily: 0, weekly: 0 });
  const [isChartVisible, setIsChartVisible] = useState(false); // Lazy load chart

  // Load data on component mount
  useEffect(() => {
  const fetchData = async () => {
    try {
      setDailyTotal(getTotalForPeriod('day') || 0);
      setWeeklyTotal(getTotalForPeriod('week') || 0);
      setMonthlyTotal(getTotalForPeriod('month') || 0);
      setSmokeFreeStreak(getSmokeFreeStreak() || 0);
      setDailyAverage(calculateAverage('day') || 0);
      setWeeklyAverage(calculateAverage('week') || 0);
      setMonthlyAverage(calculateAverage('month') || 0);
      setGoal(getGoal() || { daily: 0, weekly: 0 });
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
  const barData = useMemo(() => ({
    labels: ['Today', 'This Week', 'This Month (Avg)'],
    datasets: [
      {
        label: 'Cigarettes Smoked',
        data: [dailyTotal, weeklyTotal, monthlyTotal / 30].map(val => val || 0),
        backgroundColor: ['#FFA500', '#FFD700', '#808080'],
      },
    ],
  }), [dailyTotal, weeklyTotal, monthlyTotal]);

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
          position: 'top',
        },
      },
    };
  }, [dailyTotal, weeklyTotal, monthlyTotal]);

  return (
    <div className="stats-dashboard">
      <h1 className="page-header">Smoking Dashboard</h1>
      <p>Smoke-Free Streak: <span className="highlight">{smokeFreeStreak}</span> days</p>

      {/* Stats grid container */}
      <div className="stats-grid">
        {/* Averages Section */}
        <div className="stats-section averages">
          <h3>Averages</h3>
          <p>Daily: <span className="highlight">{dailyAverage}</span> cigarettes</p>
          <p>Weekly: <span className="highlight">{weeklyAverage}</span> cigarettes</p>
          <p>Monthly: <span className="highlight">{monthlyAverage}</span> cigarettes</p>
        </div>

        {/* Goals Section */}
        <div className="stats-section goals">
          <h3>Goals</h3>
          <p>Daily Goal: <span className="highlight">{goal.daily}</span> cigarettes</p>
          <p>Weekly Goal: <span className="highlight">{goal.weekly}</span> cigarettes</p>
        </div>

        {/* Current Usage Section */}
        <div className="stats-section comparison-insights">
          <h3>Current Usage</h3>
          <p>This Week: <span className="highlight">{weeklyTotal}</span> cigarettes</p>
          <p>This Month: <span className="highlight">{monthlyTotal}</span> cigarettes</p>
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
