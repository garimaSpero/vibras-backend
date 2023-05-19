module.exports =  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CustomerPortalDocs', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      organisationId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false
      },
      insurance: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      warranty: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      workersComp: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      licenseInformation : {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      w9Information: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      miscDocuments: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      bookingRedirectUrl: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      portalAccentColor: {
      type: Sequelize.STRING(500),
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
    await queryInterface.dropTable('CustomerPortalDocs');
  }
};
