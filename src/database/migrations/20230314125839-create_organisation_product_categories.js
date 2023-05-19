module.exports =  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrganisationProductCategories', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      organisationId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      measure: {
        type: Sequelize.TEXT,
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('OrganisationProductCategories');
  }
};
