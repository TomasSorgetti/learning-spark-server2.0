const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../../common/utils");
const service = require("./auth.service");

const login = async (req, res) => {
  try {
    const data = await service.login();
    sendSuccessResponse(res, 200, "Login success", data);
  } catch (error) {
    sendErrorResponse(res, error.message, error.status);
  }
};

module.exports = {
  login,
};
