const { Model } = require('sequelize');
const PROTECTED_ATTRIBUTES = ['createdAt', 'userId','updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class UserNote extends Model {
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
            UserNote.belongsTo(models.User, { foreignKey: 'userId' });
        }
    }
    UserNote.init({
        userId: DataTypes.STRING(36).BINARY,
        note: {
                type: DataTypes.TEXT, 
                allowNull: false,
            }, 
        },      
    {
        sequelize,
        modelName: 'UserNote',
    });



    return UserNote;
};
