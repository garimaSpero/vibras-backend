module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.createTable('ContactProposals', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      contactId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
      },
      organisationId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false
      },
      proposalId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM,
        values: ['inprogress', 'sent', 'accepted', 'rejected'],
        defaultValue: 'inprogress',
      },
      signedPdf: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      signatureUrl: {
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
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ContactProposals');
  }
};
