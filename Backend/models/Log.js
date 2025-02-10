const { DataTypes } = require("sequelize");
const sequelize = require("../config/db").sequelize;

const Log = sequelize.define(
  "Log",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["add", "remove"]],
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Log;
