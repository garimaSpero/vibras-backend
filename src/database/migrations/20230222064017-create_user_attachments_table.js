module.exports =  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.createTable('UserAttachments', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      attachment: {
        type: Sequelize.TEXT(),
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
    await queryInterface.dropTable('UserAttachments');
  }
};
