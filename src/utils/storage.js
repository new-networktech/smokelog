const LOGS_KEY = 'smokeLogs';
const GOAL_KEY = 'smokeGoal';
const PRICE_KEY = 'smokePrice';

// In-memory fallback in case localStorage is unavailable
const inMemoryStorage = {};

/**
 * Check if localStorage is available, falling back to in-memory storage if not.
 */
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`localStorage unavailable, using in-memory storage for key "${key}"`);
    inMemoryStorage[key] = JSON.stringify(value);
  }
}

function safeGetItem(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.warn(`localStorage unavailable, using in-memory storage for key "${key}"`);
    return inMemoryStorage[key] ? JSON.parse(inMemoryStorage[key]) : null;
  }
}

function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`localStorage unavailable, clearing in-memory storage for key "${key}"`);
    delete inMemoryStorage[key];
  }
}

/**
 * Saves a new smoking log entry with quantity and timestamp.
 * @param {Object} log - The log entry containing quantity and timestamp.
 */
export function saveLog(log) {
  const logs = getLogs();
  logs.push(log);
  safeSetItem(LOGS_KEY, logs);
}

/**
 * Retrieves all smoking logs from storage.
 * @returns {Array} Array of log entries.
 */
export function getLogs() {
  return safeGetItem(LOGS_KEY) || [];
}

/**
 * Clears all smoking logs from storage.
 */
export function clearLogs() {
  safeRemoveItem(LOGS_KEY);
}

/**
 * Sets a goal for daily or weekly cigarette limits.
 * @param {Object} goal - An object containing daily and/or weekly goals.
 */
export function setGoal(goal) {
  safeSetItem(GOAL_KEY, goal);
}

/**
 * Retrieves the goal from storage.
 * @returns {Object} The goal object or an empty object if no goal is set.
 */
export function getGoal() {
  return safeGetItem(GOAL_KEY) || {};
}

/**
 * Sets the price of a cigarette pack to calculate financial savings.
 * @param {number} price - The price of a cigarette pack.
 */
export function setPrice(price) {
  safeSetItem(PRICE_KEY, price);
}

/**
 * Retrieves the pack price from storage.
 * @returns {number} The pack price or 0 if no price is set.
 */
export function getPrice() {
  return parseFloat(safeGetItem(PRICE_KEY)) || 0;
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
      return logDate > previousWeekDate && logDate <= new Date();
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
