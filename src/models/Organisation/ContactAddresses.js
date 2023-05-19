const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['id', 'createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class ContactAddresses extends Model {
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
            ContactAddresses.belongsTo(models.Organisation, { foreignKey: 'organisationId' });
            ContactAddresses.belongsTo(models.Contact, { foreignKey: 'contactId' });
        }
    }
    ContactAddresses.init({
        name: DataTypes.STRING,
        contactId: DataTypes.STRING(36).BINARY,
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
        modelName: 'ContactAddresses',
    });

    return ContactAddresses;
};
