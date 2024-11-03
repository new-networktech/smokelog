// src/pages/DetailedLog.js
import React from 'react';
import { getLogs } from '../utils/storage';

function DetailedLog() {
  const logs = getLogs();

  return (
    <div className="detailed-log">
      <h2>Detailed Smoking Log</h2>
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
            const logDate = new Date(log.timestamp);
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
