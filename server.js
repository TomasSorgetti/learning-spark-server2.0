const app = require("./src/app.js");
const { serverConfig } = require("./src/config/index.config.js");

app.listen(serverConfig.port, () => {
  console.log("- - - - - - - - - - - - - - - - - - - - -");
  console.log("-                                       -");
  console.log(`Server is running on ${serverConfig.serverUrl}`);
  console.log("-                                       -");
  console.log("- - - - - - - - - - - - - - - - - - - - -");
});
