const sequelize = require("../database/connection");
const { DataTypes } = require("sequelize");

const NewUser = sequelize.define("NewUser", {
  fname: DataTypes.STRING,
  lname: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  password: DataTypes.STRING,
  verification_code: DataTypes.STRING,
});

module.exports = NewUser;
