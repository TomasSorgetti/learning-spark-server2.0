// database/index.js
const { sequelize, authenticateDatabase } = require('./connection');
const defineRelationships = require('./relations');
const { createRoles } = require('./init');

const db = {};

const initializeDatabase = async () => {
  await authenticateDatabase();

  db.user = require('./models/user.model')(sequelize);
  db.role = require('./models/role.model')(sequelize);
  db.emailVerification = require('./models/emailVerification.model')(sequelize);

  defineRelationships(db);

  await sequelize.sync({ force: false });
  console.log('Database synchronized.');

  await createRoles(db.role);
};

initializeDatabase().catch((error) => {
  console.error('Error initializing database:', error);
});

db.sequelize = sequelize;

module.exports = db;
