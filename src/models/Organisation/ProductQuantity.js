const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['productId', 'createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class ProductQuantity extends Model {
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
            ProductQuantity.belongsTo(models.OrganisationProduct, { foreignKey: 'productId' });
        }
    }
    ProductQuantity.init({
        productId: DataTypes.STRING(36).BINARY,
        stock: DataTypes.STRING,
        committed: DataTypes.STRING,
        onOrder: DataTypes.STRING,
        target: DataTypes.STRING,
        lowThreshold: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'ProductQuantity',
    });

    return ProductQuantity;
};
