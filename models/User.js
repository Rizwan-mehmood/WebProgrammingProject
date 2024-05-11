const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const User = sequelize.define("User", {
  fname: DataTypes.STRING,
  lname: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
  },
  bio: DataTypes.STRING,
  image_path: DataTypes.STRING,
  password: DataTypes.STRING,
});

module.exports = User;
