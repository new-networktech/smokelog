// Path: Backend/models/logModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Log = sequelize.define(
  "Log",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

User.hasMany(Log, { foreignKey: "userId" });
Log.belongsTo(User, { foreignKey: "userId" });

module.exports = Log;
