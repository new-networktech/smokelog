// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const logRoutes = require("./routes/logRoutes");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", logRoutes);
app.use("/api/auth", authRoutes); // This mounts authRoutes correctly

// Start server after syncing DB
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Tables are synchronized.");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to synchronize database:", err);
  });
