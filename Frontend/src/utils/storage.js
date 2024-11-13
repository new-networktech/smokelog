//smokelog\Frontend\src\utils\storage.js
const LOGS_KEY = 'smokeLogs';
const GOAL_KEY = 'smokeGoal';
const PRICE_KEY = 'smokePrice';
const isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined";

const inMemoryStorage = {};

/**
 * Safe method to set an item in storage.
 */
function safeSetItem(key, value) {
  if (isBrowser) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`localStorage unavailable, using in-memory storage for key "${key}"`);
      inMemoryStorage[key] = JSON.stringify(value);
    }
  } else {
    inMemoryStorage[key] = JSON.stringify(value);
  }
}

/**
 * Safe method to retrieve an item from storage.
 */
function safeGetItem(key) {
  if (isBrowser) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : inMemoryStorage[key] ? JSON.parse(inMemoryStorage[key]) : null;
    } catch (error) {
      console.warn(`localStorage unavailable, using in-memory storage for key "${key}"`);
      return inMemoryStorage[key] ? JSON.parse(inMemoryStorage[key]) : null;
    }
  }
  return inMemoryStorage[key] ? JSON.parse(inMemoryStorage[key]) : null;
}

/**
 * Safe method to remove an item from storage.
 */
function safeRemoveItem(key) {
  if (isBrowser) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`localStorage unavailable, clearing in-memory storage for key "${key}"`);
      delete inMemoryStorage[key];
    }
  } else {
    delete inMemoryStorage[key];
  }
}

// Exported functions for managing logs, goals, and price

export function saveLog(log) {
  const logs = getLogs();
  logs.push(log);
  safeSetItem(LOGS_KEY, logs);
}

export function getLogs() {
  return safeGetItem(LOGS_KEY) || [];
}

export function clearLogs() {
  safeRemoveItem(LOGS_KEY);
}

export function setGoal(goal) {
  safeSetItem(GOAL_KEY, goal);
}

export function getGoal() {
  return safeGetItem(GOAL_KEY) || {};
}

export function setPrice(price) {
  safeSetItem(PRICE_KEY, price);
}

export function getPrice() {
  return parseFloat(safeGetItem(PRICE_KEY)) || 0;
}

/**
 * Calculates the total number of cigarettes smoked in a specified period.
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
 * Utility to check if two dates are within the same week.
 */
function isSameWeek(date1, date2) {
  const oneJan = new Date(date2.getFullYear(), 0, 1);
  const week1 = Math.ceil((((date1 - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
  const week2 = Math.ceil((((date2 - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
  return week1 === week2 && date1.getFullYear() === date2.getFullYear();
}

/**
 * Utility to check if two dates are within the same month and year.
 */
function isSameMonth(date1, date2) {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
}

/**
 * Calculates potential savings based on cigarettes avoided compared to the goal.
 */
export function calculateSavings() {
  const goal = getGoal().daily || 0;
  const price = getPrice();
  const actualTotal = getTotalForPeriod('day');
  const avoidedCigarettes = Math.max(0, goal - actualTotal);
  const cigarettesPerPack = 20;

  return ((avoidedCigarettes / cigarettesPerPack) * price).toFixed(2);
}

/**
 * Calculates the number of smoke-free days in a row, up to today.
 */
export function getSmokeFreeStreak() {
  const logs = getLogs();
  let streak = 0;
  let currentDate = new Date();

  // Add a limit to prevent infinite loop
  const limitDays = 365;  // Max one year for smoke-free streak calculation
  let attempts = 0;

  while (attempts < limitDays) {
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
    attempts++;
  }

  if (attempts === limitDays) {
    console.warn("Limit reached in getSmokeFreeStreak calculation");
  }

  return streak;
}

/**
 * Calculates the average number of cigarettes smoked over a specified period.
 */
export function calculateAverage(period) {
  const total = getTotalForPeriod(period);
  const days = period === 'week' ? 7 : 30;
  return (total / days).toFixed(2);
}
