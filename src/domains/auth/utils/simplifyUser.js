const simplifyUser = (user) => {
  return {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    deleted: user.deleted,
    verified: user.verified,
    roles: user.roles.map((role) => role.name),
  };
};

module.exports = simplifyUser;