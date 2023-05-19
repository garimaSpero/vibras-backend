const { Model } = require('sequelize');
const crypto = require('crypto');
const PROTECTED_ATTRIBUTES = ['updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class Proposal extends Model {
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
            Proposal.hasOne(models.ProposalTitle, { foreignKey: 'proposalId', as: 'ProposalTitle'  });
            Proposal.hasOne(models.ProposalIntroduction, { foreignKey: 'proposalId', as: 'ProposalIntroduction' });
            Proposal.hasMany(models.ProposalQuoteDetail, { foreignKey: 'proposalId', as: 'ProposalQuoteDetail' });
            Proposal.hasOne(models.ProposalTermsCondition, { foreignKey: 'proposalId', as: 'ProposalTermsCondition' });
            Proposal.hasOne(models.ProposalWarranties, { foreignKey: 'proposalId', as: 'ProposalWarranty' });
            Proposal.hasOne(models.ContactProposal, { foreignKey: 'proposalId', as: 'ContactProposal' });
            Proposal.hasMany(models.ProposalCustomPage, { foreignKey: 'proposalId', as: 'ProposalCustomPage' });
            Proposal.belongsTo(models.User, { foreignKey: 'organisationId', targetKey: 'organisationId' });
            Proposal.belongsTo(models.Organisation, { foreignKey: 'organisationId', targetKey: 'id' });
        }
    }
    Proposal.init({
        name: DataTypes.STRING,
        colorCode: DataTypes.STRING(255),
        organisationId: {
            type: DataTypes.STRING(36).BINARY,
            allowNull: false
        },
        isCustom: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
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
        modelName: 'Proposal',
    });

    Proposal.addHook('afterCreate', async (proposal, options, models) => {
        const proposalId = proposal.id;
        const organisationId = proposal.organisationId;
        // console.log("sequelize.models",this.sequelize.models.ProposalTitles)
        await sequelize.models.ProposalTitle.create({
            id: crypto.randomUUID(),
            pageTitle: 'Title',
            page: 'title',
            proposalId: proposalId,
            organisationId: organisationId,
            pageNumber: 1
        }).then(async (proposalTitle) => {
            if (!proposalTitle) { cb(null, sendErrorResponse(res, 400, 'Something went wrong')); }
        });

        await sequelize.models.ProposalIntroduction.create({
            id: crypto.randomUUID(),
            pageTitle: 'Introduction',
            page: 'intro',
            proposalId: proposalId,
            organisationId: organisationId,
            pageNumber: 2
        }).then(async (ProposalIntroduction) => {
            if (!ProposalIntroduction) { cb(null, sendErrorResponse(res, 400, 'Something went wrong')); }
        });

        await sequelize.models.ProposalQuoteDetail.create({
            id: crypto.randomUUID(),
            pageTitle: 'Quote Details',
            page: 'quote',
            proposalId: proposalId,
            organisationId: organisationId,
            pageNumber: 3
        }).then(async (ProposalQuote) => {
            if (!ProposalQuote) { cb(null, sendErrorResponse(res, 400, 'Something went wrong')); }
        });
        await sequelize.models.ProposalTermsCondition.create({
            id: crypto.randomUUID(),
            pageTitle: 'Terms and Conditions',
            page: 'term',
            proposalId: proposalId,
            organisationId: organisationId,
            pageNumber: 4
        }).then(async (ProposalTermsAndConditions) => {
            if (!ProposalTermsAndConditions) { cb(null, sendErrorResponse(res, 400, 'Something went wrong')); }
        });
        await sequelize.models.ProposalWarranties.create({
            id: crypto.randomUUID(),
            pageTitle: 'Warranty',
            page: 'warranty',
            proposalId: proposalId,
            organisationId: organisationId,
            pageNumber: 5
        }).then(async (ProposalWarranties) => {
            if (!ProposalWarranties) { cb(null, sendErrorResponse(res, 400, 'Something went wrong')); }
        });

    });
    
    return Proposal;
};
