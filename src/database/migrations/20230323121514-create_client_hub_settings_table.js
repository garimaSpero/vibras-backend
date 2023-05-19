module.exports =  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ClientHubSettings', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      setting: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      shortName: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      onSrc: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      offSrc: {
        type: Sequelize.STRING(255),
        allowNull: true
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ClientHubSettings');
  }
};
