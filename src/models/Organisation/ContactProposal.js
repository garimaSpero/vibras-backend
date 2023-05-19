const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['organisationId', 'createdAt', 'updatedAt'];

module.exports = (sequelize, DataTypes) => {
    class ContactProposal extends Model {
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
            ContactProposal.belongsTo(models.Proposal, { foreignKey: 'proposalId' });
            ContactProposal.belongsTo(models.Contact, { foreignKey: 'contactId' });
        }
    }
    ContactProposal.init({
        proposalId: {
            type: DataTypes.STRING(36).BINARY,
            allowNull: false,
        },
        organisationId: DataTypes.STRING(36).BINARY,
        contactId: DataTypes.STRING(36).BINARY,
        signedPdf: DataTypes.TEXT,
        signatureUrl: DataTypes.TEXT,
        status: {
            type: DataTypes.ENUM,
            values: ['inprogress', 'sent'],
            defaultValue: 'inprogress',
        }
    }, {
        sequelize,
        modelName: 'ContactProposal',
    });

    return ContactProposal;
};
