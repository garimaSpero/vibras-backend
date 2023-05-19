const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class Appointment extends Model {
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
            Appointment.belongsTo(models.ColorCode, { foreignKey: 'colorCodeId' });
            Appointment.belongsTo(models.OrganisationEventType, { foreignKey: 'eventTypeId' });
            Appointment.belongsTo(models.User, { foreignKey: 'assignedTo' });
            Appointment.belongsTo(models.Contact, { foreignKey: 'contactId' });
        }
    }
    Appointment.init({
        organisationId: DataTypes.STRING(36).BINARY,
        colorCodeId: DataTypes.STRING(36).BINARY,
        eventTypeId: DataTypes.STRING(36).BINARY,
        assignedTo: DataTypes.STRING(36).BINARY,
        contactId: DataTypes.STRING(36).BINARY,
        appointmentDate: DataTypes.STRING,
        appointmentDetails: DataTypes.STRING,
        eventDuration: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Appointment',
    });

    return Appointment;
};
