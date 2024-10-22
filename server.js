const app = require("./src/app.js");
const { serverConfig } = require("./src/common/config");

app.listen(serverConfig.port, () => {
  console.log("- - - - - - - - - - - - - - - - - - - - -");
  console.log("-                                       -");
  console.log(`Server is running on ${serverConfig.serverUrl}`);
  console.log("-                                       -");
  console.log("- - - - - - - - - - - - - - - - - - - - -");
});
