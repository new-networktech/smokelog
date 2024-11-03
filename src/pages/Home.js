import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { getTotalForPeriod, setGoal, getGoal, saveLog, getLogs } from '../utils/storage';
import '../styles/Home.css';

ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

function Home() {
  const [dailyTotal, setDailyTotal] = useState(0);
  const [goal, setGoalState] = useState(10);
  const [lastSmokeMessage, setLastSmokeMessage] = useState('');

  useEffect(() => {
    setDailyTotal(getTotalForPeriod('day'));
    setGoalState(getGoal().daily || 10);
    updateLastSmokeTime();
  }, []);

  const handleGoalChange = (e) => {
    const newGoal = parseInt(e.target.value, 10);
    setGoalState(newGoal);
    setGoal({ daily: newGoal });
  };

  const handleLogEvent = () => {
    const logEntry = { quantity: 1, timestamp: new Date().toISOString() };
    saveLog(logEntry);
    setDailyTotal(getTotalForPeriod('day'));
    updateLastSmokeTime();
  };

  const handleRemoveEvent = () => {
    const logs = getLogs();
    if (logs.length > 0) {
      logs.pop();
      localStorage.setItem('smokeLogs', JSON.stringify(logs));
      setDailyTotal(getTotalForPeriod('day'));
      updateLastSmokeTime();
    }
  };

  // Calculate the time since the last smoke event and update the message
  const updateLastSmokeTime = () => {
    const logs = getLogs();
    if (logs.length > 0) {
      const lastLogTime = new Date(logs[logs.length - 1].timestamp);
      const now = new Date();
      const diffMinutes = Math.floor((now - lastLogTime) / 60000); // Convert ms to minutes

      if (diffMinutes < 60) {
        setLastSmokeMessage(`Last smoke was ${diffMinutes} minute(s) ago.`);
      } else {
        const diffHours = Math.floor(diffMinutes / 60);
        setLastSmokeMessage(`Last smoke was ${diffHours} hour(s) ago.`);
      }
    } else {
      setLastSmokeMessage("No smoking events logged yet.");
    }
  };

  const percentage = Math.min((dailyTotal / goal) * 100, 100);
  const chartData = {
    labels: ['Progress', 'Remaining'],
    datasets: [
      {
        data: [dailyTotal, Math.max(goal - dailyTotal, 0)],
        backgroundColor: [percentage >= 90 ? '#FF5555' : '#FFA500', '#D3D3D3'],
        hoverBackgroundColor: [percentage >= 90 ? '#FF8888' : '#FF8C00', '#C0C0C0'],
      },
    ],
  };

  return (
    <div className="fade-in home-container">
      <h1>Your Smoking Log</h1>

      <p className="last-smoke-message">{lastSmokeMessage}</p> {/* Display last smoke message */}

      <div className="goal-input-container">
        <label htmlFor="dailyGoal">Set Daily Goal:</label>
        <input
          type="number"
          id="dailyGoal"
          min="1"
          value={goal}
          onChange={handleGoalChange}
        />
      </div>

      <div className="right-section">
        <div className="donut-chart">
          <Doughnut
            data={chartData}
            options={{
              cutout: '70%',
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
