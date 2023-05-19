'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    await queryInterface.createTable('ProposalQuoteDetailSections', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      proposalQuoteDetailId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        references: {
          model: 'ProposalQuoteDetails',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      sectionTitle: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      sectionTotal: {
        type: Sequelize.FLOAT(),
        defaultValue: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('ProposalQuoteDetailSections');
  }
};
