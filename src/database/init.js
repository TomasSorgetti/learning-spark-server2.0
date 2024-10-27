const createRoles = async (Role) => {
  const roles = ['Owner', 'Admin', 'User'];
  for (const roleName of roles) {
    const roleExists = await Role.findOne({ where: { name: roleName } });
    if (!roleExists) {
      await Role.create({ name: roleName });
      console.log(`${roleName} role created`);
    } else {
      console.log(`${roleName} role already exists`);
    }
  }
};

module.exports = { createRoles };
