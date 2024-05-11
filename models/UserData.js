const sequelize = require("../database/connection");
const { DataTypes } = require("sequelize");

const UserData = sequelize.define("UserData", {
    email: DataTypes.STRING,
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    facebook: DataTypes.STRING,
    linkedin: DataTypes.STRING,
    github: DataTypes.STRING,
    instituteName: DataTypes.STRING,
    degreeName: DataTypes.STRING,
    field: DataTypes.STRING,
    startDate: DataTypes.STRING,
    endDate: DataTypes.STRING,
    studyCountry: DataTypes.STRING,
    studyCity: DataTypes.STRING,
    marks: DataTypes.STRING,
});

module.exports = UserData;
