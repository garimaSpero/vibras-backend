const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['organisationId', 'createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class Crew extends Model {
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
            Crew.belongsTo(models.Organisation, { foreignKey: 'organisationId' });
        }
    }
    Crew.init({
        organisationId: DataTypes.STRING(36).BINARY,
        name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Crew',
    });

    return Crew;
};
