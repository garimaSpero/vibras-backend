const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class OrganisationNotification extends Model {
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
            OrganisationNotification.belongsTo(models.Notification, { foreignKey: 'notificationId' });   
        }
    }
    OrganisationNotification.init({
        organisationId: DataTypes.STRING(36).BINARY,
        notificationId: DataTypes.STRING(36).BINARY,
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        sequelize,
        modelName: 'OrganisationNotification',
    });

    return OrganisationNotification;
};
