module.exports =  {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrganisationProducts', {
      id: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
        primaryKey: true
      },
      organisationId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: false,
      },
      categoryId: {
        type: Sequelize.STRING(100).BINARY,
        allowNull: true,
      },
      productNumber: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM,
        values: ['service', 'product'],
        defaultValue: 'service',
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      sku: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      manufacturer: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      unitOfMeasure: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      unit: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      image: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      imageThumbnail: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isTaxable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      requireQuantity: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isInventory: {
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
    await queryInterface.dropTable('OrganisationProducts');
  }
};
