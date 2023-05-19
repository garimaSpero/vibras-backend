const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['productId', 'createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class ProductPrice extends Model {
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
            ProductPrice.belongsTo(models.OrganisationProduct, { foreignKey: 'productId' });
        }
    }
    ProductPrice.init({
        productId: DataTypes.STRING(36).BINARY,
        price: DataTypes.STRING,
        minPrice: DataTypes.STRING,
        cost: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'ProductPrice',
    });

    return ProductPrice;
};
