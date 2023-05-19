const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['organisationId', 'createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class OrganisationClientHubSetting extends Model {
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
            OrganisationClientHubSetting.belongsTo(models.ClientHubSetting, { foreignKey: 'settingId' });
        }
    }
    OrganisationClientHubSetting.init({
        organisationId: DataTypes.STRING(36).BINARY,
        settingId: DataTypes.STRING(36).BINARY,
        isEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        shareUrl: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        sequelize,
        modelName: 'OrganisationClientHubSetting',
    });



    return OrganisationClientHubSetting;
};
