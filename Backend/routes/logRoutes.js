// routes/logRoutes.js
const express = require("express");
const { addLog, getLogs, removeLog } = require("../controllers/logController");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

// Route to add a log entry for the authenticated user
router.post("/log", authenticateToken, addLog);

// Route to get all logs for the authenticated user
router.get("/logs", authenticateToken, getLogs);

// Route to remove a log entry for the authenticated user
router.delete("/log", authenticateToken, removeLog);

module.exports = router;
