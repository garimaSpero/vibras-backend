const { Model } = require('sequelize');

module.exports =  (sequelize, DataTypes) => {
  class Role extends Model {
  
  }
  Role.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Role already exists',
      },
    },
  }, {
    sequelize,
    modelName: 'Role',
    timestamps: false,
  });
  return Role;
};
