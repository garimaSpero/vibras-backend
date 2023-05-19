const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['organisationId', 'createdAt', 'updatedAt'];

module.exports = (sequelize, DataTypes) => {
    class ProposalInternalNote extends Model {
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
            ProposalInternalNote.belongsTo(models.ProposalTitle, { foreignKey: 'pageId' });
            ProposalInternalNote.belongsTo(models.ProposalIntroduction, { foreignKey: 'pageId' });
            ProposalInternalNote.belongsTo(models.ProposalQuoteDetail, { foreignKey: 'pageId' });
            ProposalInternalNote.belongsTo(models.ProposalTermsCondition, { foreignKey: 'pageId' });
            ProposalInternalNote.belongsTo(models.ProposalWarranties, { foreignKey: 'pageId' });
            ProposalInternalNote.belongsTo(models.ProposalCustomPage, { foreignKey: 'pageId' });
        }
    }
    ProposalInternalNote.init({
        proposalId: {
            type: DataTypes.STRING(36).BINARY,
            allowNull: false
        },
        pageId: {
            type: DataTypes.STRING(36).BINARY,
            allowNull: true
        },
        note: DataTypes.TEXT,
        attachment: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'ProposalInternalNote',
    });

    return ProposalInternalNote;
};
