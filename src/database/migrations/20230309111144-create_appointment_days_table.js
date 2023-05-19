module.exports =  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AppointmentRequestDays', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      organisationId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false
      },
      monday: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      tuesday: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      wednesday: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      thursday: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      friday: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      saturday: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      sunday: {
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AppointmentRequestDays');
  }
};
