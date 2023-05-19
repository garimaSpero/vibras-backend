const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class OrganisationProduct extends Model {
        toJSON() {
            // hide protected fields
            const attributes = { ...this.get() };
            // eslint-disable-next-line no-restricted-syntax
            for (const a of PROTECTED_ATTRIBUTES) {
                delete attributes[a];
            }
            return attributes;
        }
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            OrganisationProduct.hasMany(models.ProductPrice, { foreignKey: 'productId' });
            OrganisationProduct.hasMany(models.ProductQuantity, { foreignKey: 'productId' });
            OrganisationProduct.hasMany(models.ProductConversionRate, { foreignKey: 'productId' });
            OrganisationProduct.hasMany(models.ProductNote, { foreignKey: 'productId' });
            OrganisationProduct.belongsTo(models.OrganisationProductCategory, { foreignKey: 'categoryId' });
            OrganisationProduct.hasMany(models.ProposalQuoteDetailSectionItem, { foreignKey: 'productId' });

        }
    }
    OrganisationProduct.init({
        organisationId: DataTypes.STRING(36).BINARY,
        categoryId: DataTypes.STRING(36).BINARY,
        productNumber: DataTypes.STRING,
        type: { 
            type: DataTypes.ENUM('service', 'product'),
            defaultValue: 'service' 
        },
        name: DataTypes.STRING,
        sku: DataTypes.STRING,
        manufacturer: DataTypes.STRING,
        description: DataTypes.STRING,
        unitOfMeasure: DataTypes.STRING,
        unit: DataTypes.STRING,
        image: DataTypes.STRING,
        imageThumbnail: DataTypes.STRING,
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isTaxable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        requireQuantity: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isInventory: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        sequelize,
        modelName: 'OrganisationProduct',
    });

    return OrganisationProduct;
};
