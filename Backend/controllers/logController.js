// controllers/logController.js
const { Op } = require("sequelize");
const Log = require("../models/logModel");

// Add new log entry
const addLog = async (req, res) => {
  const { quantity } = req.body;
  const userId = req.user.userId; // Get userId from authenticated user

  try {
    const newLog = await Log.create({ quantity, date: new Date(), userId });
    console.log(`Log entry added: ${JSON.stringify(newLog)}`);
    res.status(201).json(newLog);
  } catch (error) {
    console.error("Error creating log entry:", error);
    res.status(500).json({ message: "Error creating log entry", error });
  }
};

// Get logs based on time filter
const getLogs = async (req, res) => {
  const { filter } = req.query;
  const userId = req.user.userId; // Get userId from authenticated user

  let whereCondition = { userId }; // Restrict logs to the current user only

  const now = new Date();
  switch (filter) {
    case "lastDay":
      whereCondition.date = {
        [Op.gte]: new Date(now.setDate(now.getDate() - 1)),
      };
      break;
    case "last3Days":
      whereCondition.date = {
        [Op.gte]: new Date(now.setDate(now.getDate() - 3)),
      };
      break;
    case "lastWeek":
      whereCondition.date = {
        [Op.gte]: new Date(now.setDate(now.getDate() - 7)),
      };
      break;
    case "lastMonth":
      whereCondition.date = {
        [Op.gte]: new Date(now.setMonth(now.getMonth() - 1)),
      };
      break;
    case "lastYear":
      whereCondition.date = {
        [Op.gte]: new Date(now.setFullYear(now.getFullYear() - 1)),
      };
      break;
    default:
      break;
  }

  try {
    const logs = await Log.findAll({ where: whereCondition });
    console.log(`Logs fetched for filter ${filter}: ${JSON.stringify(logs)}`);
    const total = logs.reduce((acc, log) => acc + log.quantity, 0);
    res.status(200).json({ logs, total });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Error fetching logs", error });
  }
};

// Remove the latest log entry
const removeLog = async (req, res) => {
  const userId = req.user.userId; // Get userId from authenticated user

  try {
    const latestLog = await Log.findOne({
      where: { userId },
      order: [["date", "DESC"]],
    });
    if (!latestLog) {
      console.log("No logs found to delete");
      return res.status(404).json({ message: "No logs found to delete" });
    }
    await latestLog.destroy();
    console.log(`Log entry removed: ${JSON.stringify(latestLog)}`);
    res.status(200).json({ message: "Latest log removed successfully" });
  } catch (error) {
    console.error("Error removing log entry:", error);
    res.status(500).json({ message: "Error removing log entry", error });
  }
};

module.exports = { addLog, getLogs, removeLog };
