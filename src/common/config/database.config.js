require('dotenv').config();

const databaseConfig = {
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbDialect: process.env.DB_DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

module.exports = databaseConfig;
