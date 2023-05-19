const { Model } = require('sequelize');
const crypto = require('crypto');
const PROTECTED_ATTRIBUTES = ['organisationId', 'createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class ProposalQuoteDetail extends Model {
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
            ProposalQuoteDetail.belongsTo(models.Proposal, { foreignKey: 'proposalId' });
            ProposalQuoteDetail.hasMany(models.ProposalQuoteDetailSection, { foreignKey: 'proposalQuoteDetailId', as: 'ProposalQuoteDetailSection' });
            ProposalQuoteDetail.hasMany(models.ProposalInternalNote, { foreignKey: 'pageId', as: 'ProposalInternalNote' });

            ProposalQuoteDetail.hasOne(models.QuoteDetailPageSetting, { foreignKey: 'quoteDetailPageId' });
        }
    }
    ProposalQuoteDetail.init({
        proposalId: {
            type: DataTypes.STRING(36).BINARY,
            allowNull: false
        },
        organisationId: {
            type: DataTypes.STRING(36).BINARY,
            allowNull: false
        },
        pageTitle: DataTypes.STRING,
        pageNumber: {
            type: DataTypes.STRING(36).BINARY,
            allowNull: true
        },
        page: DataTypes.STRING,
        profitMargin: {
            type: DataTypes.STRING,
            allowNull: true
        },
        quoteSubtotal: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        note: DataTypes.TEXT,
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        isTemplate: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        pdf: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'ProposalQuoteDetail',
    });
    ProposalQuoteDetail.addHook('afterCreate', async (quoteDetail, options, models) => {
        const id = quoteDetail.id;
        const proposalId = quoteDetail.proposalId;
        await sequelize.models.QuoteDetailPageSetting.create({
            id: crypto.randomUUID(),
            proposalId: proposalId,
            quoteDetailPageId: id,
            showQuantity: true,
            showUnitPrice: true,
            showLineTotal: true,
            showSectionTotal: true,
            selectOnlyOneQuote: true,
        }).then(async (ProposalQuoteDetail) => {
            if (!ProposalQuoteDetail) { cb(null, sendErrorResponse(res, 400, 'Something went wrong')); }
        });

    });

    return ProposalQuoteDetail;
};
