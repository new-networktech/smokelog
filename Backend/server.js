// server.js
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/logs", require("./routes/logs"));
app.use("/api/test", require("./routes/test"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is running" });
});

const PORT = process.env.PORT || 5000;

// Sync database and start server
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = app;
