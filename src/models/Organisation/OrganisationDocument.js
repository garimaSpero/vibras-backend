const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['organisationId','updatedAt'];

module.exports = (sequelize, DataTypes) => {
    class OrganisationDocument extends Model {
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
    OrganisationDocument.init({
        organisationId: DataTypes.STRING(36).BINARY,
        type: DataTypes.STRING,
        name: DataTypes.STRING,
        file: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'OrganisationDocument',
    });

    return OrganisationDocument;
};
