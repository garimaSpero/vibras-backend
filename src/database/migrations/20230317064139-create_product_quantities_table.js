module.exports =  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.createTable('ProductQuantities', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      productId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        references: {
          model: 'OrganisationProducts',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      stock: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      committed: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      onOrder: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      target: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      lowThreshold: {
        type: Sequelize.STRING(255),
        allowNull: true
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
    await queryInterface.dropTable('ProductQuantities');
  }
};
