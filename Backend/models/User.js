// Path: Backend/models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // sequelize is now the instance, not an object

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
