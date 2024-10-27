const { sequelize, authenticateDatabase } = require('./connection');
const defineRelationships = require('./relations');

const initializeDatabase = async () => {
  await authenticateDatabase();

  const db = {};
  db.user = require('./models/user.model')(sequelize);
  db.role = require('./models/role.model')(sequelize);

  defineRelationships(db);

  await sequelize.sync({ force: false });

  return db;
};

module.exports = initializeDatabase;
