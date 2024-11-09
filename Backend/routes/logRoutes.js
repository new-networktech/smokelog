// routes/logRoutes.js
const express = require("express");
const { addLog, getLogs, removeLog } = require("../controllers/logController");
const router = express.Router();

router.post("/log", addLog);
router.get("/logs", getLogs);
router.delete("/log", removeLog);

module.exports = router;
