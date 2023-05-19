module.exports =  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrganisationClientHubSettings', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      organisationId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
      },
      settingId: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      isEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      shareUrl: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: true,
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
    await queryInterface.dropTable('OrganisationClientHubSettings');
  }
};
