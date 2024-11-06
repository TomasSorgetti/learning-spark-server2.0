const { sendSuccessResponse } = require('../../common/utils');
const service = require('./role.service');

const getAllRoles = async (req, res, next) => {
  try {
    const data = await service.getAllRoles();
    sendSuccessResponse(res, 200, 'Get all roles success', data);
  } catch (error) {
    next(error);
  }
};

const createRole = async (req, res, next) => {
  const { name } = req.body;
  try {
    const data = await service.createRole(name);
    sendSuccessResponse(res, 200, 'Role created', data);
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  const { name } = req.params;
  const { newName } = req.body;
  try {
    const data = await service.updateRole({ name, newName });
    sendSuccessResponse(res, 200, 'Role updated', data);
  } catch (error) {
    next(error);
  }
};
const deleteRole = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await service.deleteRole(id);
    sendSuccessResponse(res, 200, 'Role deleted', data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
};
