const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class EventType extends Model {
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
            EventType.hasMany(models.OrganisationEventType, { foreignKey: 'parentId' });
        }
    }
    EventType.init({
        name: DataTypes.STRING,
        color: DataTypes.STRING,
        colorCode: DataTypes.STRING,
        duration: DataTypes.STRING,
        isCalendar: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        sequelize,
        modelName: 'EventType',
    });

    return EventType;
};
