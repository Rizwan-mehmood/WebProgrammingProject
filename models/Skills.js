const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Skills = sequelize.define("Skills", {
  email: DataTypes.STRING,
  skillName: DataTypes.STRING,
  experience: DataTypes.STRING,
});

module.exports = Skills;
