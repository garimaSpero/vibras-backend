module.exports =  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      firstName: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      lastName: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      profileImage:{
        type: Sequelize.STRING(255),
        allowNull: true
      },
      profileImageThumbnail: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      organisationId: {
        type: Sequelize.STRING(100).BINARY,
      },
      phone: {
        type: Sequelize.STRING(100),
      },
      roleId: {
        type: Sequelize.STRING(100).BINARY,
      },
      status: {
        type: Sequelize.ENUM,
        values: ['inactive', 'active', 'suspended'],
        defaultValue: 'inactive',
      },
      emailNotifications: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      textNotifications: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      twoFactorAuth: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      token: {
        type: Sequelize.TEXT(),
        defaultValue: false,
      },
      defaultCalender: {
        type: Sequelize.ENUM,
        values: ['week', 'month'],
        defaultValue: 'week',
      },
      signature: {
        type: Sequelize.TEXT,
        defaultValue: false,
      },
      isVerified: {
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
    await queryInterface.dropTable('Users');
  }
};
