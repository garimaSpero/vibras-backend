const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['organisationId', 'createdAt', 'updatedAt'];

module.exports = (sequelize, DataTypes) => {
    class QuoteDetailPageSetting extends Model {
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
            QuoteDetailPageSetting.belongsTo(models.ProposalQuoteDetail, { foreignKey: 'quoteDetailPageId' });
        }
    }
    QuoteDetailPageSetting.init({
        proposalId: {
            type: DataTypes.STRING(36).BINARY,
            allowNull: false
        },
        quoteDetailPageId: {
            type: DataTypes.STRING(36).BINARY,
            allowNull: false
        },
        showQuantity: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        showUnitPrice: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        showLineTotal: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        showSectionTotal: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        selectOnlyOneQuote: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        sequelize,
        modelName: 'QuoteDetailPageSetting',
    });

    return QuoteDetailPageSetting;
};
