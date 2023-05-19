const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class Industry extends Model {
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
    Industry.init({
        name: DataTypes.STRING,
        status: {
            type: DataTypes.ENUM('inactive', 'active'),
            defaultValue: 'active',
        },
    }, {
        sequelize,
        modelName: 'Industry',
    });



    return Industry;
};
