const app = require('./src/app.js');
const { serverConfig } = require('./src/common/config');
const initializeDatabase = require('./src/database/index.js');

const startServer = async () => {
  try {
    await initializeDatabase();
    console.log('Database synchronized.');
    app.listen(serverConfig.port, () => {
      console.log('- - - - - - - - - - - - - - - - - - - - -');
      console.log('-                                       -');
      console.log(`Server is running on ${serverConfig.serverUrl}`);
      console.log('-                                       -');
      console.log('- - - - - - - - - - - - - - - - - - - - -');
    });
  } catch (error) {
    console.error('Error during server startup:', error);
  }
};
startServer();
