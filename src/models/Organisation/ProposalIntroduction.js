const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['organisationId', 'createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class ProposalIntroduction extends Model {
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
            ProposalIntroduction.belongsTo(models.Proposal, { foreignKey: 'proposalId' });
            ProposalIntroduction.hasMany(models.ProposalInternalNote, { foreignKey: 'pageId', as: 'ProposalInternalNote' });
        }
    }
    ProposalIntroduction.init({
        proposalId: {
            type: DataTypes.STRING(36).BINARY,
            allowNull: false
        },
        organisationId: {
            type: DataTypes.STRING(36).BINARY,
            allowNull: false
        },
        pageNumber: {
            type: DataTypes.STRING(36).BINARY,
            allowNull: true
        },
        page: DataTypes.STRING,
        pageTitle: DataTypes.STRING,
        pageText: DataTypes.TEXT,
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
        modelName: 'ProposalIntroduction',
    });

    return ProposalIntroduction;
};
