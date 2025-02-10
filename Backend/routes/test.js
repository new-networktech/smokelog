const express = require("express");
const router = express.Router();
const { sequelize } = require("../config/db");

router.get("/db-test", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: "Database connection successful",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database test error:", error);
    res.status(500).json({
      error: "Database connection failed",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Database error",
    });
  }
});

module.exports = router;
