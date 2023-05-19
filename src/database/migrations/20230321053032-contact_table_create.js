module.exports =  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Contacts', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      organisationId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
      },
      contactNumber: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      firstName: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      lastName: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true
      },
      companyName: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(100),
      },
      fax: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      website: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      leadSource: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      type: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      dealOwnerId: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      isBusinessAccount: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      emailNotifications: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      userId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Contacts');
  }
};
