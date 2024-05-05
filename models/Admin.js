const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Admin = sequelize.define("Admin", {
  username: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: DataTypes.STRING,
});

module.exports = Admin;
