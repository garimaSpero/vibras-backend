const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class OrganisationEventType extends Model {
        toJSON() {
            // hide protected fields
            const attributes = { ...this.get() };
            // eslint-disable-next-line no-restricted-syntax
            for (const a of PROTECTED_ATTRIBUTES) {
                delete attributes[a];
            }
            return attributes;
        }
        static associate(models) {
            OrganisationEventType.hasMany(models.Appointment, { foreignKey: 'eventTypeId' });
            OrganisationEventType.belongsTo(models.EventType, { foreignKey: 'parentId' });   

        }
    }
    OrganisationEventType.init({
        organisationId: DataTypes.STRING(36).BINARY,
        name: DataTypes.STRING,
        color: DataTypes.STRING,
        colorCode: DataTypes.STRING,
        duration: DataTypes.STRING,
        parentId: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'OrganisationEventType',
    });

    return OrganisationEventType;
};
