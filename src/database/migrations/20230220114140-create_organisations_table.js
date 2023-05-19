module.exports =  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Organisations', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      companyNumber: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      name: {
        type: Sequelize.STRING(100),
      },
      shortName: {
        type: Sequelize.STRING(255),
      },
      customerBookingLink: {
        type: Sequelize.STRING(255),
      },
      timeZone: {
        type: Sequelize.STRING(50),
      },
      licenseNumber: {
        type: Sequelize.STRING(100),
      },
      businessName: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      industryId: {
        type: Sequelize.STRING(36).BINARY,
      },
      noOfEmployee: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING(20),
      },
      replyEmail: {
        type: Sequelize.STRING(100),
      },
      taxRate: {
        type: Sequelize.STRING(20),
      },
      websiteUrl: {
        type: Sequelize.STRING(255),
      },
      reviewUrl: {
        type: Sequelize.STRING(255),
      },
      facebookUrl: {
        type: Sequelize.STRING(255),
      },
      instagramUrl: {
        type: Sequelize.STRING(255),
      },
      linkedinUrl: {
        type: Sequelize.STRING(255),
      },
      twitterUrl: {
        type: Sequelize.STRING(255),
      },
      logo: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      logoThumbnail: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      source: {
        type: Sequelize.STRING(100),
      },
      defaultCurrency: {
        type: Sequelize.STRING(20),
      },
      bccEmail: {
        type: Sequelize.STRING(100),
      },
      proposalColor: {
        type: Sequelize.STRING(100),
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
    await queryInterface.dropTable('Organisations');
  }
};
