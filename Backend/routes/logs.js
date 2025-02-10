const express = require("express");
const router = express.Router();
const { Log } = require("../models");
const { Op } = require("sequelize");
const authenticateToken = require("../middleware/authMiddleware");

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get logs with filter
router.get("/", async (req, res) => {
  try {
    const { filter } = req.query;
    const userId = req.user.userId;

    let whereClause = {
      userId,
    };

    if (filter === "lastDay") {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      whereClause.createdAt = {
        [Op.gte]: oneDayAgo,
      };
    }

    const logs = await Log.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    // Calculate total (add actions increase, remove actions decrease)
    const total = logs.reduce((acc, log) => {
      return log.action === "add" ? acc + 1 : acc - 1;
    }, 0);

    res.json({
      logs,
      total: Math.max(total, 0), // Ensure total doesn't go below 0
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Error fetching logs" });
  }
});

// Create log
router.post("/", async (req, res) => {
  try {
    const { action } = req.body;
    const userId = req.user.userId;

    // Validate action
    if (!["add", "remove"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    // For remove action, check if there are logs to remove
    if (action === "remove") {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const todayLogs = await Log.findAll({
        where: {
          userId,
          createdAt: {
            [Op.gte]: oneDayAgo,
          },
        },
      });

      const total = todayLogs.reduce((acc, log) => {
        return log.action === "add" ? acc + 1 : acc - 1;
      }, 0);

      if (total <= 0) {
        return res.status(400).json({ error: "No logs to remove" });
      }
    }

    const log = await Log.create({
      userId,
      action,
      date: new Date(),
    });

    res.status(201).json(log);
  } catch (error) {
    console.error("Error creating log:", error);
    res.status(500).json({
      error: "Error creating log",
      details: error.message,
    });
  }
});

// Get last smoke
router.get("/last-smoke", async (req, res) => {
  try {
    const userId = req.user.userId;
    const lastSmoke = await Log.findOne({
      where: {
        userId,
        action: "add", // Only look for add actions for last smoke time
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({ lastSmoke });
  } catch (error) {
    console.error("Error fetching last smoke:", error);
    res.status(500).json({ error: "Error fetching last smoke" });
  }
});

module.exports = router;
