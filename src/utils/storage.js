// src/utils/storage.js

const LOGS_KEY = 'smokeLogs';
const GOAL_KEY = 'smokeGoal';
const PRICE_KEY = 'smokePrice';  // for tracking financial savings

/**
 * Saves a new smoking log entry with quantity and timestamp.
 * @param {Object} log - The log entry containing quantity and timestamp.
 */
export function saveLog(log) {
  const logs = getLogs();
  logs.push(log);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

/**
 * Retrieves all smoking logs from local storage.
 * @returns {Array} Array of log entries.
 */
export function getLogs() {
  const logs = localStorage.getItem(LOGS_KEY);
  return logs ? JSON.parse(logs) : [];
}

/**
 * Clears all smoking logs from local storage.
 */
export function clearLogs() {
  localStorage.removeItem(LOGS_KEY);
}

/**
 * Sets a goal for daily or weekly cigarette limits.
 * @param {Object} goal - An object containing daily and/or weekly goals.
 */
export function setGoal(goal) {
  localStorage.setItem(GOAL_KEY, JSON.stringify(goal));
}

/**
 * Retrieves the goal from local storage.
 * @returns {Object} The goal object or an empty object if no goal is set.
 */
export function getGoal() {
  const goal = localStorage.getItem(GOAL_KEY);
  return goal ? JSON.parse(goal) : {};
}

/**
 * Sets the price of a cigarette pack to calculate financial savings.
 * @param {number} price - The price of a cigarette pack.
 */
export function setPrice(price) {
  localStorage.setItem(PRICE_KEY, price);
}

/**
 * Retrieves the pack price from local storage.
 * @returns {number} The pack price or 0 if no price is set.
 */
export function getPrice() {
  return parseFloat(localStorage.getItem(PRICE_KEY)) || 0;
}

/**
 * Calculates total cigarettes smoked for a specified period.
 * @param {string} period - Period type ('day', 'week', or 'month').
 * @returns {number} Total cigarettes smoked in the specified period.
 */
export function getTotalForPeriod(period) {
  const logs = getLogs();
  const now = new Date();
  
  return logs.reduce((total, log) => {
    const logDate = new Date(log.timestamp);
    
    if (
      (period === 'day' && logDate.toDateString() === now.toDateString()) ||
      (period === 'week' && isSameWeek(logDate, now)) ||
      (period === 'month' && isSameMonth(logDate, now))
    ) {
      return total + log.quantity;
    }
    return total;
  }, 0);
}

/**
 * Utility function to check if two dates are in the same week.
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean}
 */
function isSameWeek(date1, date2) {
  const oneJan = new Date(date2.getFullYear(), 0, 1);
  const week1 = Math.ceil(((date1 - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
  const week2 = Math.ceil(((date2 - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
  return week1 === week2 && date1.getFullYear() === date2.getFullYear();
}

/**
 * Utility function to check if two dates are in the same month and year.
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean}
 */
function isSameMonth(date1, date2) {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
}

/**
 * Calculates potential savings based on the price per pack and cigarettes avoided.
 * @returns {number} Financial savings.
 */
export function calculateSavings() {
  const goal = getGoal().daily || 0; // Assuming daily goal is set in cigarettes per day
  const price = getPrice();
  const actualTotal = getTotalForPeriod('day');
  const avoidedCigarettes = Math.max(0, goal - actualTotal);
  const cigarettesPerPack = 20; // Assuming 20 cigarettes per pack

  return ((avoidedCigarettes / cigarettesPerPack) * price).toFixed(2);
}

export function getSmokeFreeStreak() {
  const logs = getLogs();
  let streak = 0;
  let currentDate = new Date();

  while (true) {
    const dayLogs = logs.filter(log => {
      const logDate = new Date(log.timestamp).toDateString();
      return logDate === currentDate.toDateString();
    });

    if (dayLogs.length === 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
export function calculateAverage(period) {
  const total = getTotalForPeriod(period);
  const days = period === 'week' ? 7 : 30; // 7 for week, 30 for month
  return (total / days).toFixed(2);
}
export function getWeeklyComparison() {
  const logs = getLogs();
  const currentWeekTotal = getTotalForPeriod('week');
  const previousWeekDate = new Date();
  previousWeekDate.setDate(previousWeekDate.getDate() - 7);

  const previousWeekTotal = logs
    .filter(log => {
      const logDate = new Date(log.timestamp);
      return (
        logDate > previousWeekDate &&
        logDate <= new Date()
      );
    })
    .reduce((total, log) => total + log.quantity, 0);

  return [previousWeekTotal, currentWeekTotal];
}

export function getPreviousPeriodTotal(period) {
  const logs = getLogs();
  const now = new Date();
  const previousStart = new Date();

  if (period === 'week') {
    previousStart.setDate(now.getDate() - 7);
  } else if (period === 'month') {
    previousStart.setMonth(now.getMonth() - 1);
  }

  return logs.reduce((total, log) => {
    const logDate = new Date(log.timestamp);
    if (logDate >= previousStart && logDate < now) {
      return total + log.quantity;
    }
    return total;
  }, 0);
}
