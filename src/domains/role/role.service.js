const { HttpError, errorCodes } = require('../../common/errors');
const db = require('../../database/index.js');

const getAllRoles = async () => {
  return await db.role.findAll({
    attributes: ['id', 'name'],
  });
};

const createRole = async (name) => {
  const roleFound = await db.role.findOne({ where: { name } });
  if (roleFound) {
    throw new HttpError(
      409,
      errorCodes.ROLE_ALREADY_EXISTS,
      'Role already exists'
    );
  }

  return await db.role.create({ name });
};

const updateRole = async ({ name, newName }) => {
  const roleFound = await db.role.findOne({ where: { name } });
  if (!roleFound) {
    throw new HttpError(404, errorCodes.ROLE_NOT_FOUND, 'Role not found');
  }
  const newRoleFound = await db.role.findOne({ where: { name: newName } });
  if (newRoleFound) {
    throw new HttpError(
      409,
      errorCodes.NEW_ROLE_ALREADY_EXISTS,
      'The new role name already exists'
    );
  }
  return await roleFound.update({ name: newName });
};

const deleteRole = async (id) => {
  const roleFound = await db.role.findOne({ where: { id } });
  if (!roleFound) {
    throw new HttpError(404, errorCodes.ROLE_NOT_FOUND, 'Role not found');
  }

  return await roleFound.destroy();
};

module.exports = { getAllRoles, createRole, updateRole, deleteRole };
