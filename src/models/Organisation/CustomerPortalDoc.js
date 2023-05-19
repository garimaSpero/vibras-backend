const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['organisationId', 'createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class CustomerPortalDoc extends Model {
        toJSON() {
            // hide protected fields
            const attributes = { ...this.get() };
            // eslint-disable-next-line no-restricted-syntax
            for (const a of PROTECTED_ATTRIBUTES) {
                delete attributes[a];
            }
            return attributes;
        }
    }
    CustomerPortalDoc.init({
        organisationId: DataTypes.STRING(36).BINARY,
        insurance: DataTypes.STRING,
        warranty: DataTypes.STRING,
        workersComp: DataTypes.STRING,
        licenseInformation: DataTypes.STRING,
        w9Information: DataTypes.STRING,
        miscDocuments: DataTypes.STRING,
        bookingRedirectUrl: DataTypes.STRING,
        portalAccentColor: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'CustomerPortalDoc',
    });

    return CustomerPortalDoc;
};
