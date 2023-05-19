module.exports =  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.createTable('ContactAddresses', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      contactId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        references: {
          model: 'Contact',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      organisationId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(255),
      },
      address: {
        type: Sequelize.TEXT(),
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      zip: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      addressType: {
        type: Sequelize.ENUM,
        values: ['physical', 'billing', 'same'],
        defaultValue: 'physical',
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
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ContactAddresses');
  }
};
