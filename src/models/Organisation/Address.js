const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['id','createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class Addresses extends Model {
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
            Addresses.belongsTo(models.Organisation, { foreignKey: 'organisationId' });
            Addresses.belongsTo(models.User, { foreignKey: 'userId' });
        }
    }
    Addresses.init({
        name: DataTypes.STRING,
        userId: DataTypes.STRING(36).BINARY,
        organisationId: DataTypes.STRING(36).BINARY,
        address: DataTypes.STRING,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        zip: DataTypes.STRING,
        addressType: {
            type: DataTypes.ENUM('physical', 'billing', 'same'),
            defaultValue: 'physical',
        }
    }, {
        sequelize,
        modelName: 'Addresses',
    });



    return Addresses;
};
