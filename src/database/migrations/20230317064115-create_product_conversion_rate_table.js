module.exports =  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    await queryInterface.createTable('ProductConversionRates', {
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
      from: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      to: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      rate: {
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
    await queryInterface.dropTable('ProductConversionRates');
  }
};
