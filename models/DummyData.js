const sequelize = require("../database/connection");
const { DataTypes } = require("sequelize");

const DummyData = sequelize.define("DummyData", {
    ProductName: DataTypes.STRING,
    ProductPrice: DataTypes.STRING,
    ProductQuantity: DataTypes.STRING,
    SellerEmail: DataTypes.STRING,
    SellerName: DataTypes.STRING,
});

module.exports = DummyData;
