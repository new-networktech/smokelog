// src/pages/Stats.js
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      setDailyTotal(getTotalForPeriod('day') || 0);
      setWeeklyTotal(getTotalForPeriod('week') || 0);
      setMonthlyTotal(getTotalForPeriod('month') || 0);
      setSmokeFreeStreak(getSmokeFreeStreak() || 0);
      setDailyAverage(calculateAverage('day') || 0);
      setWeeklyAverage(calculateAverage('week') || 0);
      setMonthlyAverage(calculateAverage('month') || 0);
      setGoal(getGoal() || { daily: 0, weekly: 0 });
      setIsLoading(false);
    };

    const timeoutId = setTimeout(fetchData, 300); // Debounce with 300ms delay
    return () => clearTimeout(timeoutId);
  }, []);

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
      <h2>Smoking Dashboard</h2>
      <p>Smoke-Free Streak: <span className="highlight">{smokeFreeStreak}</span> days</p>

      <div className="stats-grid">
        <div className="stats-section averages">
          <h3>Averages</h3>
          <p>Daily: <span className="highlight">{dailyAverage}</span> cigarettes</p>
          <p>Weekly: <span className="highlight">{weeklyAverage}</span> cigarettes</p>
          <p>Monthly: <span className="highlight">{monthlyAverage}</span> cigarettes</p>
        </div>

        <div className="stats-section goal-progress">
          <h3>Goals</h3>
          <p>Daily Goal: <span className="highlight">{goal.daily}</span> cigarettes</p>
          <p>Weekly Goal: <span className="highlight">{goal.weekly}</span> cigarettes</p>
        </div>

        <div className="stats-section comparison-insights">
          <h3>Current Usage</h3>
          <p>This Week: <span className="highlight">{weeklyTotal}</span> cigarettes</p>
          <p>This Month: <span className="highlight">{monthlyTotal}</span> cigarettes</p>
        </div>
      </div>

      {isLoading ? (
        <p>Loading data...</p>
      ) : (
        <div className="chart-container">
          <h3>Daily, Weekly, Monthly Totals</h3>
          <div className="chart-scroll-container">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Stats;
