const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['organisationId', 'createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class ProposalQuoteDetailSection extends Model {
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
            ProposalQuoteDetailSection.belongsTo(models.ProposalQuoteDetail, { foreignKey: 'proposalQuoteDetailId' });
            ProposalQuoteDetailSection.hasMany(models.ProposalQuoteDetailSectionItem, { foreignKey: 'sectionId', as: 'QuoteDetailItems' });

        }
    }
    ProposalQuoteDetailSection.init({
        proposalQuoteDetailId: {
            type: DataTypes.STRING(36).BINARY,
            allowNull: false
        },
        sectionTitle: DataTypes.STRING,
        sectionTotal: {
            type: DataTypes.FLOAT(),
            defaultValue: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    }, {
        sequelize,
        modelName: 'ProposalQuoteDetailSection',
    });

    return ProposalQuoteDetailSection;
};
