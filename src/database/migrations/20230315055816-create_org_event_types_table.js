module.exports =  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrganisationEventTypes', {
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
      color: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      colorCode: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      duration: {
        type: Sequelize.INTEGER(10),
        allowNull: true
      },
      parentId: {
        type: Sequelize.STRING(100).BINARY,
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
    await queryInterface.dropTable('OrganisationEventTypes');
  }
};
