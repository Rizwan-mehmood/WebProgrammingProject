const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("shopex", "root", "riz12wan@", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
module.exports = sequelize;
