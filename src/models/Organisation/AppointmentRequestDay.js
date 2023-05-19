const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['id','organisationId', 'createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class AppointmentRequestDay extends Model {
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
            AppointmentRequestDay.belongsTo(models.Organisation, { foreignKey: 'organisationId' });
        }
    }
    AppointmentRequestDay.init({
        organisationId: DataTypes.STRING(36).BINARY,
        monday: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        tuesday: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        wednesday: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        thursday: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        friday: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        saturday: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        sunday: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        sequelize,
        modelName: 'AppointmentRequestDay',
    });



    return AppointmentRequestDay;
};
