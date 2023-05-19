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
    await queryInterface.createTable('Proposals', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      colorCode: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      organisationId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
      },
      isCustom: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isTemplate: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      templateUseCount: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
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
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Proposals');
  }
};
