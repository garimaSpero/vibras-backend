const { hash } = require('../../utils/hashing');
const model = require('../../models');
const Constants = require('../../utils/constants');
const crypto = require('crypto');

const { User, Role, Permission } = model;

module.exports =  {
  // eslint-disable-next-line no-unused-vars
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
   
    await Role.bulkCreate([
      { name: Constants.ROLE_SUPER_ADMIN },
      { name: Constants.ROLE_ADMIN },
      { name: Constants.ROLE_SALES_PERSON },
      { name: Constants.ROLE_PROJECT_MANAGER },
    ]);

    await Permission.bulkCreate([
      { name: Constants.PERMISSION_VIEW_ADMIN_DASHBOARD },
      { name: Constants.PERMISSION_VIEW_ALL_USERS },
    ]);
    const superAdminUser = await User.create({
      id: crypto.randomUUID(),
      name: 'John Doe',
      email: 'johndoe@node.com',
      password: hash('Password111'),
      phone: '+2348123456789',
    });
    
    const superAdminRole = await Role.findOne({ where: { name: Constants.ROLE_SUPER_ADMIN } });
    
    const superAdminPermissions = await Permission.findAll({
      where: {
        name: [
          Constants.PERMISSION_VIEW_ADMIN_DASHBOARD,
          Constants.PERMISSION_VIEW_ALL_USERS,
        ],
      },
    });
    await superAdminUser.addRole(superAdminRole);
    await superAdminRole.addPermissions(superAdminPermissions);
  },

  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await Role.destroy();
    await Permission.destroy();
    await User.destroy();
  },
};