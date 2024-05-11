const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const RandomData = sequelize.define("RandomData", {
  email: DataTypes.STRING,
  date: DataTypes.STRING,
  completed: DataTypes.STRING,
  rating: DataTypes.STRING,
});

module.exports = RandomData;
