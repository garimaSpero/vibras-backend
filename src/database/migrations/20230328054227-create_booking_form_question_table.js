'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('BookingFormQuestions', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      question: {
        type: Sequelize.STRING,
        defaultValue: false,
      },
      answerType: {
        type: Sequelize.ENUM,
        values: ['short_answer', 'checkbox', 'dropdown'],
        defaultValue: 'short_answer',
      },
      isRequired: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      organisationId: {
        type: Sequelize.STRING(100).BINARY,
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('BookingFormQuestions');
  }
};
