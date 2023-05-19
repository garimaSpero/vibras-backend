const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['createdAt', 'updatedAt'];

module.exports = (sequelize, DataTypes) => {
    class ClientHubSetting extends Model {
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
            ClientHubSetting.hasMany(models.OrganisationClientHubSetting, { foreignKey: 'settingId' });
        }
    }
    ClientHubSetting.init({
        setting: DataTypes.STRING,
        shortName: DataTypes.STRING,
        description: DataTypes.STRING,
        onSrc: DataTypes.STRING,
        offSrc: DataTypes.STRING,
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

    }, {
        sequelize,
        modelName: 'ClientHubSetting',
    });

    return ClientHubSetting;
};
