const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class Contact extends Model {
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
            Contact.hasMany(models.ContactAddresses, { foreignKey: 'contactId', as: 'addresses' });
            Contact.belongsTo(models.User, {as:"salesPerson", foreignKey: 'userId'});
            Contact.hasMany(models.Appointment, { foreignKey: 'contactId' });
            Contact.hasMany(models.ContactProposal, { foreignKey: 'contactId' });
        }
    }
    Contact.init({
        organisationId: DataTypes.STRING(36).BINARY,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING,
        contactNumber: DataTypes.STRING,
        companyName: DataTypes.STRING,
        phone: DataTypes.STRING,
        fax: DataTypes.STRING,
        userId: DataTypes.STRING(36).BINARY,
        isBusinessAccount: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        type: DataTypes.STRING,
        dealOwnerId: DataTypes.STRING,
        leadSource: DataTypes.STRING,
        website: DataTypes.STRING,
        emailNotifications: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        sequelize,
        modelName: 'Contact',
    });

    return Contact;
};
