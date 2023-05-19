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
    await queryInterface.createTable('Appointments', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      colorCodeId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
      },
      eventTypeId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
      }, 
      organisationId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
      },
      assignedTo: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
      },
      contactId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
      },
      appointmentDate: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      eventDuration: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      appointmentDetails: {
        type: Sequelize.TEXT,
        allowNull: false,
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
    await queryInterface.dropTable('Appointments');
  }
};
