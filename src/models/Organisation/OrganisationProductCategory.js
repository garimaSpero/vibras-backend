const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class OrganisationProductCategory extends Model {
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
            OrganisationProductCategory.hasMany(models.OrganisationProduct, { foreignKey: 'categoryId' });
        }
    }
    OrganisationProductCategory.init({
        organisationId: DataTypes.STRING(36).BINARY,
        name: DataTypes.STRING,
        measure: DataTypes.TEXT,
    }, {
        sequelize,
        modelName: 'OrganisationProductCategory',
    });

    return OrganisationProductCategory;
};
