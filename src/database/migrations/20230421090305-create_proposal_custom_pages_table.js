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

    await queryInterface.createTable('ProposalCustomPages', {
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
      organisationId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        references: {
          model: 'Organisations',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      pageTitle: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      pageNumber: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
      },
      page: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      file: {
        type: Sequelize.STRING(500),
        defaultValue: true,
      },
      pageText: {
        type: Sequelize.TEXT(),
        allowNull: true,
      },
      pdf: {
        type: Sequelize.STRING(500),
        allowNull: true,
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
    await queryInterface.dropTable('ProposalCustomPages');
  }
};
