const { Sequelize } = require('sequelize');
const { databaseConfig } = require('../common/config');

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

const authenticateDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
};

module.exports = { sequelize, authenticateDatabase };
