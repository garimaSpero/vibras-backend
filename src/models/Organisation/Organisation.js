const { Model } = require('sequelize');
const PROTECTED_ATTRIBUTES = ['createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class Organisation extends Model {
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
            Organisation.hasMany(models.Addresses, { foreignKey: 'organisationId', as: 'addresses' });
            Organisation.hasMany(models.AppointmentRequestDay, { foreignKey: 'organisationId' });
            Organisation.hasMany(models.CustomerType, { foreignKey: 'organisationId' });
            Organisation.hasMany(models.CustomerPaymentType, { foreignKey: 'organisationId' });
            Organisation.hasMany(models.LeadSource, { foreignKey: 'organisationId' });
            Organisation.hasMany(models.Crew, { foreignKey: 'organisationId' });
            Organisation.hasMany(models.BookingFormSetting, { foreignKey: 'organisationId' });
            Organisation.hasMany(models.BookingFormQuestion, { foreignKey: 'organisationId' });
            // Organisation.belongsTo(models.ProposalTitle, { foreignKey: 'organisationId' });
        }
    }
    Organisation.init({
        name: DataTypes.STRING,
        companyNumber: DataTypes.STRING,
        shortName: DataTypes.STRING,
        customerBookingLink: DataTypes.STRING,
        timeZone: DataTypes.STRING,
        licenseNumber: DataTypes.STRING,
        businessName: DataTypes.STRING,
        industryId: DataTypes.STRING,
        noOfEmployee: DataTypes.STRING,
        phone: DataTypes.STRING,
        replyEmail: DataTypes.STRING,
        taxRate: DataTypes.STRING,
        websiteUrl: DataTypes.STRING,
        reviewUrl: DataTypes.STRING,
        facebookUrl: DataTypes.STRING,
        instagramUrl: DataTypes.STRING,
        linkedinUrl: DataTypes.STRING,
        twitterUrl: DataTypes.STRING,
        logo: DataTypes.STRING,
        logoThumbnail: DataTypes.STRING,
        source: DataTypes.STRING,
        defaultCurrency: DataTypes.STRING,
        bccEmail: DataTypes.STRING,
        proposalColor: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Organisation',
    });

   
    return Organisation;
};
