// Backend/config/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: console.log, // Enable logging temporarily to debug
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    retry: {
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
      ],
      max: 5,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // Sync database (in development)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("Database synced successfully.");
    }
  } catch (error) {
    console.error("Database connection error:", error);
    // Wait 5 seconds and try again
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

module.exports = { sequelize, connectDB };
