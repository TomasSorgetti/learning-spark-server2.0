const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('emailVerification', {
    emailCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    emailCodeExpires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};
