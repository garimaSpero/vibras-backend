module.exports =  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.createTable('ProductPrices', {
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
      price: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      minPrice: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      cost: {
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
    await queryInterface.dropTable('ProductPrices');
  }
};
