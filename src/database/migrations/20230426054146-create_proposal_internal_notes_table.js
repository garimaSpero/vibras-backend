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

    await queryInterface.createTable('ProposalInternalNotes', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      proposalId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        references: {
          model: 'Proposals',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      pageId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
      },
      note: {
        type: Sequelize.TEXT(),
        allowNull: true,
      },
      attachment: {
        type: Sequelize.STRING(500),
        defaultValue: true,
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
    await queryInterface.dropTable('ProposalInternalNotes');
  }
};
