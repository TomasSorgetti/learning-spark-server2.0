const { Sequelize } = require("sequelize");
const { databaseConfig } = require("../common/config");

const sequelize = new Sequelize(
  databaseConfig.dbName,
  databaseConfig.dbUser,
  databaseConfig.dbPassword,
  {
    host: databaseConfig.dbHost,
    port: databaseConfig.dbPort,
    dialect: databaseConfig.dbDialect,
    pool: databaseConfig.pool,
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// relations

module.exports = db;
