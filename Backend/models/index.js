const { Sequelize } = require("sequelize");
const sequelize = require("../config/db").sequelize;
const User = require("./User");
const Log = require("./Log");

// Define relationships
User.hasMany(Log, { foreignKey: "userId" });
Log.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  Log,
};
