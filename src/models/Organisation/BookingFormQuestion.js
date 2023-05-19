const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class BookingFormQuestion extends Model {
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
            BookingFormQuestion.belongsTo(models.Organisation, { foreignKey: 'organisationId' });
            BookingFormQuestion.hasMany(models.BookingFormAnswer, { foreignKey: 'questionId' });
        }
    }
    BookingFormQuestion.init({
        organisationId: DataTypes.STRING(36).BINARY,
        question: DataTypes.STRING,
        answerType: {
            type: DataTypes.ENUM('short_answer', 'checkbox', 'dropdown'),
            defaultValue: 'service'
        },
        isRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        sequelize,
        modelName: 'BookingFormQuestion',
    });

    return BookingFormQuestion;
};
