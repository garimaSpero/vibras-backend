const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['productId', 'createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class ProductConversionRate extends Model {
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
            ProductConversionRate.belongsTo(models.OrganisationProduct, { foreignKey: 'productId' });
        }
    }
    ProductConversionRate.init({
        productId: DataTypes.STRING(36).BINARY,
        from: DataTypes.STRING,
        to: DataTypes.STRING,
        rate: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'ProductConversionRate',
    });

    return ProductConversionRate;
};
