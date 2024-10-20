const { sendErrorResponse, sendSuccessResponse } = require("../../utils");
const service = require("./auth.service");

const login = async (req, res) => {
  const { email, password, persist } = req.body;
  try {
    const data = await service.login(res, { email, password, persist });
    sendSuccessResponse(res, 200, "Login success", data);
  } catch (error) {
    sendErrorResponse(res, error.message, error.status);
  }
};

module.exports = {
  login,
};
