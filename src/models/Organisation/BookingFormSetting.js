const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class BookingFormSetting extends Model {
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
            BookingFormSetting.belongsTo(models.Organisation, { foreignKey: 'organisationId' });
        }
    }
    BookingFormSetting.init({
        organisationId: DataTypes.STRING(36).BINARY,
        serviceDetailStatus: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        appointmentDateTimeStatus: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        sequelize,
        modelName: 'BookingFormSetting',
    });

    return BookingFormSetting;
};
