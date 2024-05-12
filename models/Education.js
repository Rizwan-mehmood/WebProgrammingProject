const sequelize = require("../database/connection");
const { DataTypes } = require("sequelize");

const Education = sequelize.define("Education", {
    email: DataTypes.STRING,
    instituteName: DataTypes.STRING,
    degreeName: DataTypes.STRING,
    field: DataTypes.STRING,
    startDate: DataTypes.STRING,
    endDate: DataTypes.STRING,
    studyCountry: DataTypes.STRING,
    studyCity: DataTypes.STRING,
    marks: DataTypes.STRING,
});

module.exports = Education;
