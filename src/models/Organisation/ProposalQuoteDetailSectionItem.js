const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['createdAt', 'updatedAt'];

module.exports = (sequelize, DataTypes) => {
    class ProposalQuoteDetailSectionItem extends Model {
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
            ProposalQuoteDetailSectionItem.belongsTo(models.ProposalQuoteDetailSection, { foreignKey: 'sectionId' });
            ProposalQuoteDetailSectionItem.belongsTo(models.OrganisationProduct, { foreignKey: 'productId' });
        }
      
    }
    ProposalQuoteDetailSectionItem.init({
        sectionId: {
            type: DataTypes.STRING(36).BINARY,
            allowNull: false
        },
        productId: {
            type: DataTypes.STRING(36).BINARY,
            allowNull: false
        },
        isOptional: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        quantity: {
            type: DataTypes.INTEGER(10),
            allowNull: true,
        },
        price: {
            type: DataTypes.FLOAT(),
            allowNull: true,
        },
        lineTotal: {
            type: DataTypes.FLOAT(),
            allowNull: true,
        }
    }, {
        sequelize,
        modelName: 'ProposalQuoteDetailSectionItem',
    });

    return ProposalQuoteDetailSectionItem;
};
