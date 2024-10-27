const app = require("./src/app.js");
const { serverConfig } = require("./src/common/config");
const db = require("./src/database/connection");

const startServer = async () => {
  try {
    await db.sequelize.sync({ force: false });
    console.log("Database synchronized.");
    app.listen(serverConfig.port, () => {
      console.log("- - - - - - - - - - - - - - - - - - - - -");
      console.log("-                                       -");
      console.log(`Server is running on ${serverConfig.serverUrl}`);
      console.log("-                                       -");
      console.log("- - - - - - - - - - - - - - - - - - - - -");
    });
  } catch (error) {
    console.error("Error during server startup:", error);
    process.exit(1);
  }
};
startServer();
