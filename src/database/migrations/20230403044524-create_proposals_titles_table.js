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

    await queryInterface.createTable('ProposalTitles', {
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
      },
      pageNumber: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
      },
      page: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      pageTitle: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      proposalDate: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      imageThumbnail: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      logo: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      logoThumbnail: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      firstName: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING(255),
        defaultValue: true,
      },
      address: {
        type: Sequelize.TEXT(),
        defaultValue: true,
      },
      city: {
        type: Sequelize.STRING(255),
        defaultValue: true,
      },
      state: {
        type: Sequelize.STRING(255),
        defaultValue: true,
      },
      zipCode: {
        type: Sequelize.STRING(255),
        defaultValue: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isTemplate: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      pdf: {
        type: Sequelize.STRING(500),
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
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('ProposalTitles');
  }
};
