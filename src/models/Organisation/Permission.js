const { Model } = require('sequelize');

module.exports =  (sequelize, DataTypes) => {
  class Permission extends Model {
    
  }
  Permission.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Permission already exists',
      },
    },
  }, {
    sequelize,
    modelName: 'Permission',
    timestamps: false,
  });
  return Permission;
};
