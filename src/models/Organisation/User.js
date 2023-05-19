const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['password', 'createdAt', 'updatedAt'];

module.exports =  (sequelize, DataTypes) => {
    class User extends Model {
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
            User.belongsTo(models.Organisation);
            User.belongsTo(models.Role);
            User.hasMany(models.UserNote, { foreignKey: 'userId', as: 'userNotes' });
            User.hasMany(models.UserAttachment, { foreignKey: 'userId', as: 'userAttachments' });
            User.hasMany(models.Addresses, { foreignKey: 'userId', as: 'addresses' });
            User.hasMany(models.Appointment, { foreignKey: 'assignedTo' });
        }
    }
    User.init({
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        profileImage: DataTypes.STRING,
        profileImageThumbnail: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        organisationId: DataTypes.STRING,
        phone: DataTypes.STRING,
        roleId: DataTypes.STRING,
        emailNotifications: { 
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        textNotifications: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        twoFactorAuth: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        status: {
            type: DataTypes.ENUM('inactive', 'active', 'suspended'),
            defaultValue: 'active',
        },
        token: DataTypes.TEXT,
        defaultCalender: {
            type: DataTypes.ENUM('week', 'month'),
            defaultValue: 'week',
        },
        signature: DataTypes.TEXT,
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        sequelize,
        modelName: 'User',
    });


    User.prototype.hasRole = async function hasRole(role) {
        if (!role || role === 'undefined') {
            return false;
        }
        const roles = await this.getRoles();
        return !!roles.map(({ name }) => name)
            .includes(role);
    };

    User.prototype.hasPermission = async function hasPermission(permission) {
        if (!permission || permission === 'undefined') {
            return false;
        }
        const permissions = await this.getPermissions();
        return !!permissions.map(({ name }) => name)
            .includes(permission.name);
    };

    User.prototype.hasPermissionThroughRole = async function hasPermissionThroughRole(permission) {
        if (!permission || permission === 'undefined') {
            return false;
        }
        const roles = await this.getRoles();
        // eslint-disable-next-line no-restricted-syntax
        for await (const item of permission.roles) {
            if (roles.filter(role => role.name === item.name).length > 0) {
                return true;
            }
        }
        return false;
    };

    User.prototype.hasPermissionTo = async function hasPermissionTo(permission) {
        if (!permission || permission === 'undefined') {
            return false;
        }
        return await this.hasPermissionThroughRole(permission) || this.hasPermission(permission);
    };
    

    return User;
};
