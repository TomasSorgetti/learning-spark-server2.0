const { sendSuccessResponse } = require('../../common/utils');
const service = require('./user.service');

const changePassword = async (req, res, next) => {
  const { user } = req;
  const { password, newPassword } = req.body;

  try {
    await service.changePassword({
      user,
      password,
      newPassword,
    });
    sendSuccessResponse(res, 201, 'Change password success', null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  changePassword,
};
