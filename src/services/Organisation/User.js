'use strict';
let Promise = require('bluebird');
const { Op } = require('sequelize');
const crypto = require('crypto');
const model = require('../../models');
const { sendErrorResponse, sendSuccessResponse } = require('../../utils/sendResponse');


const { User, Organisation, Addresses, UserAttachment, UserNote, Role } = model;
const bcrypt = require("bcryptjs");

module.exports = {
    getUsers: getUsers,
    getUser: getUser,
    checkUser: checkUser,
    createUser: createUser,
    updateUser: updateUser,
    changePassword: changePassword,
    logout: logout,

    getOrganisationId: getOrganisationId,
    getOrganisationUsers: getOrganisationUsers,

    getUserNotes: getUserNotes,
    saveUserNotes: saveUserNotes,
    createNote: createNote,
    deleteUserNote: deleteUserNote,

    getUserAttachments: getUserAttachments,
    saveUserAttachment: saveUserAttachment,
    saveAttachment: saveAttachment,
    deleteAttachment: deleteAttachment,
   
    saveUserAddresses: saveUserAddresses,
    addedUserRole: addedUserRole,
  
    deleteUser: deleteUser
};

function getUsers(userId, organisationId, limit, page, search, res, cb) {
    if (organisationId == null) {
        return User.findByPk(userId)
            .then((user) => {
                return this.getOrganisationUsersAsync(user.organisationId, userId, limit, page, search, res)
                    .then((users) => {
                        cb(null, users)
                    })
            })
    } else {
        return this.getOrganisationUsersAsync(organisationId, userId, limit, page, search, res)
            .then((users) => {
                cb(null, users)
            })
    }
}

function getUser(loggedinUser, userId, res, cb) {
    return User.findOne({
        where: { id: userId },
        include: [
            {   model: Organisation,
                attributes: [ 'name','logo','logoThumbnail']
            },
            {
                model: UserNote,
                attributes: ['id', 'note'],
                as: 'userNotes'
            },
            {
                model: UserAttachment,
                attributes: ['id', 'attachment'],
                as: 'userAttachments'
            },
            {
                model: Addresses,
                attributes: ['name', 'address', 'city', 'state', 'zip', 'addressType'],
                as: 'addresses'
            }

        ]
    }).then((user) => {
            if (!user) {
                cb(null, sendErrorResponse(res, 404, 'No User found'));
            } else {

                if (!user.isVerified && user.id == loggedinUser) {
                    cb(null, sendSuccessResponse(res, 200, [], 'Please verify email address'))
                }
                cb(null, {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profileImage: user.profileImage,
                    profileImageThumbnail: user.profileImageThumbnail,
                    email: user.email,
                    phone: user.phone,
                    status: user.status,
                    roleId: user.roleId,
                    emailNotifications: user.emailNotifications,
                    textNotifications: user.textNotifications,
                    twoFactorAuth: user.twoFactorAuth,
                    defaultCalender: user.defaultCalender,
                    organisationId: user.organisationId,
                    userNotes: user.userNotes,
                    userAttachments: user.userAttachments,
                    addresses: user.addresses,
                    companyName: user.Organisation.name,
                    logo: user.Organisation.logo,
                    logoThumbnail: user.Organisation.logoThumbnail,
                    isVerified: user.isVerified
                });
            }
        });

}

function checkUser(userId, reqData, res, cb){
    return User.findByPk(userId)
        .then((user) => {
            let phone = reqData.phone;
            let email = reqData.email;
            return User.findOne({ where: { [Op.or]: [{ phone }, { email }] } }).then((userExists) => {
                if (userExists) {
                    cb(null, sendErrorResponse(res, 422, 'User with that email or phone already exists'));
                } else {
                    return Organisation.findByPk(user.organisationId).then((organisation) => {
                        if (!organisation) {
                            cb(null, sendErrorResponse(res, 404, 'organisation not found'));
                        } else {
                            cb(null, user);
                        }
                    })
                }
            })
        })
}

function createUser(userId, reqData, res, cb) {
    return this.checkUserAsync(userId, reqData, res).then((user) => {
        if (user){
            return User.create({
                id: crypto.randomUUID(),
                firstName: reqData.firstName,
                lastName: reqData.lastName,
                email: reqData.email,
                password: bcrypt.hashSync(reqData.password, 8),
                organisationId: user.organisationId,
                phone: reqData.phone,
                roleId: reqData.roleId,
                status: 'active',
                emailNotifications: reqData.emailNotifications,
                textNotifications: reqData.textNotifications,
                twoFactorAuth: reqData.twoFactorAuth,
                defaultCalender: reqData.defaultCalender
            }).then((addedUser) => {
                if (!addedUser) {
                    cb(null, sendErrorResponse(res, 400, 'Something went wrong'));
                } else {
                    return this.addedUserRoleAsync(addedUser, reqData.roleId);
                }
            }).then((addedUser) => {
                if (reqData.addresses) {
                    this.saveUserAddressesAsync(reqData.addresses, addedUser.id, user.organisationId)
                }
                cb(null, {
                    id: addedUser.id,
                    name: addedUser.firstName,
                    email: addedUser.email,
                    phone: addedUser.phone,
                    status: addedUser.status
                })

            })
        }
    })
}

function updateUser(userId, reqData, res, cb) {
    return User.findByPk(userId).then((user) => {
        if (!user) {
            cb(null, sendErrorResponse(res, 404, 'User not found'))
        }
        return User.update({
            firstName: reqData.firstName,
            lastName: reqData.lastName,
            phone: reqData.phone,
            roleId: reqData.roleId,
            status: 'active',
            emailNotifications: reqData.emailNotifications,
            textNotifications: reqData.textNotifications,
            twoFactorAuth: reqData.twoFactorAuth,
            defaultCalender: reqData.defaultCalender
        }, {
            where: { id: user.id }
        }).then((updatedUser) => {
            if (!updatedUser) {
                cb(null, sendErrorResponse(res, 400, 'Something went wrong'));
            }
            if (reqData.roleId) {
                let assignRole = Role.findOne({ where: { id: reqData.roleId } })
                user.addRole(assignRole);
            }
            if (reqData.addresses) {
                this.saveUserAddressesAsync(reqData.addresses, user.id, user.organisationId)
            }
        })
    }).then(() => {
        return User.findByPk(userId, {
            include: [Organisation,
                {
                    model: UserNote,
                    attributes: ['id', 'note'],
                    as: 'userNotes'
                },
                {
                    model: UserAttachment,
                    attributes: ['id', 'attachment'],
                    as: 'userAttachments'
                },
                {
                    model: Addresses,
                    attributes: ['name', 'address', 'city', 'state', 'zip', 'addressType'],
                    as: 'addresses'
                }]
        }).then((updatedUser) => {
            if (!updatedUser) {
                cb(null, sendErrorResponse(res, 400, 'Something went wrong'));
            }
            cb(null, {
                id: updatedUser.id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                status: updatedUser.status,
                roleId: updatedUser.roleId,
                emailNotifications: updatedUser.emailNotifications,
                textNotifications: updatedUser.textNotifications,
                twoFactorAuth: updatedUser.twoFactorAuth,
                defaultCalender: updatedUser.defaultCalender,
                organisationId: updatedUser.OrganisationId,
                userNotes: updatedUser.userNotes,
                userAttachments: updatedUser.userAttachments,
                addresses: updatedUser.addresses,
                companyName: updatedUser.Organisation.name,
                logo: updatedUser.Organisation.logo
            })
        })
    })
}

function changePassword(userId, reqData, res, cb) {
    return this.checkPasswordAsync(userId, reqData, res).then((user) => {
        return bcrypt.hash(reqData.newPassword, 10)
            .then((hashedNewPassword) => {
                if (!hashedNewPassword) {
                    cb(null, sendErrorResponse(res, 400, 'something went wrong'));
                }
                return User.update({ password: hashedNewPassword }, {
                    where: { id: user.id }
                }).then((updated) => {
                    if (updated) {
                        cb(null, 'Password changed successfully');
                    }
                })
            })
    })
}

function logout(userId, res, cb) {
    return User.update({ token: null }, { where: { id: userId } }).then((updated) => {
        if (!updated) {
            cb(sendErrorResponse(res, 400, 'Something went wrong'));
        }
        cb(null, 'User logout successfully');
    });
}

function addedUserRole(addedUser, roleId, cb) {
    return User.findByPk(addedUser.id)
        .then((user) => {
            return Role.findByPk(roleId)
                .then((assignRole) => {
                    user.addRole(assignRole);
                    cb(null, addedUser)
                });
        });
}

function getUserNotes(userId, res, cb){
    return User.findByPk(userId).then((user) => {
        if (!user){
            cb(null, sendErrorResponse(res, 404, 'User not found'));
        }
        return UserNote.findAll({ where: { userId :userId } }).then((notes) => {
            if (!notes) {
                cb(null, []);
            }
            cb(null, notes)
        })
    })
}

function saveUserNotes(notes, userId, cb) {
    const noteData = notes.map((note) => {
        return {
            id: crypto.randomUUID(),
            note: note,
            userId: userId
        }
    });
    return UserNote.bulkCreate(noteData).then((notes) => {
        if (!notes) {
            cb(null, "Something went wrong");
        } else {
            cb(null, "Note inserted successfully");
        }
    });
}

function createNote(reqData, res, cb) {
    return User.findByPk(reqData.userId)
        .then((user) => {
            if (!user) {
                cb(null, sendErrorResponse(res, 404, 'User not found'));
            } 
            return UserNote.create({
                id: crypto.randomUUID(),
                userId: reqData.userId,
                note: reqData.note,
            }).then((note) => {
                if(!note){
                    cb(null, sendErrorResponse(res, 400, 'Something went wrong'));
                }
                cb(null, note);
            })
    });
}

function deleteUserNote(noteId, res, cb) {
    return UserNote.findByPk(noteId)
        .then((note) => {
            if (!note) {
                cb(sendErrorResponse(res, 404, 'Note not found'));
            } else {
                return UserNote.destroy({
                    where: {
                        id: noteId
                    }
                }).then(function (rowDeleted) {
                    if (rowDeleted === 1) {
                        cb(null, 'Note deleted successfully');
                    }
                })
            }
        });
}

function getUserAttachments(userId, res, cb){
    return User.findByPk(userId).then((user) => {
        if (!user) {
            cb(null, sendErrorResponse(res, 404, 'User not found'));
        }

        return UserAttachment.findAll({ where: { userId: userId } }).then((attachments) => {
            if (!attachments) {
                cb(null, []);
            }
            cb(null, attachments)
        })
    }) 
}

function saveUserAttachment(attachments, userId, cb){
    const attachmentData = attachments.map((attachment) => {
        return {
            id: crypto.randomUUID(),
            attachment: attachment,
            userId: userId
        }
    });
    return UserAttachment.bulkCreate(attachmentData)
    .then((attachment) => {
        if (!attachment) {
            cb(null, "Something went wrong");
        } else {
            cb(null, "Attachment inserted successfully");
        }
    });
}

function saveAttachment(userId, fileName, res, cb) {
    return User.findByPk(userId).then((user) => {
        if (!user) {
            cb(null, sendErrorResponse(res, 404, 'User not found'));
        }
        return UserAttachment.create({
            id: crypto.randomUUID(),
            userId: userId,
            attachment: fileName,
        }).then((attachment) => {
            if (!attachment) {
                cb(null, sendErrorResponse(res, 400, 'Something went wrong'));
            }
            return {
                id: attachment.id,
                attachment: attachment.attachment,
            }
        })
    });
}

function deleteAttachment(attachmentId, res, cb) {
    return UserAttachment.findByPk(attachmentId)
        .then((userAttachment) => {
            if (!userAttachment) {
                cb(null, sendErrorResponse(res, 404, 'Attachment not found'))
            }
            return UserAttachment.destroy({
                where: {
                    id: attachmentId
                }
            }).then(function (rowDeleted) {
                console.log('rowdeleted');
                if (rowDeleted === 1) {
                    cb(null, 'Attachment deleted successfully');
                }
            });
        });
}

function saveUserAddresses(addresses, userId, organisationId, cb){
    const newAddress = addresses.map(v => ({ ...v, id: crypto.randomUUID(), userId: userId, organisationId: organisationId }));
    return Addresses.bulkCreate(newAddress)
    .then((addressess) => {
        if (!addressess) {
            cb(null, "Something went wrong");
        } else {
            cb(null, userId);
        }
    });
}

function getOrganisationUsers(orgId, userId, limit, page, search, res, cb){
    const pageNumber = page;
    const pageSize = limit;
    const whereCondition = {};
    if (search !== '') {
        if (search.name || search.email || search.status) {
            whereCondition[Op.or] = [
                { firstName: { [Op.like]: `%${search.name}%` } },
                { lastName: { [Op.like]: `%${search.name}%` } },
                { email: { [Op.like]: `%${search.email}%` } },
                { status: { [Op.like]: `${search.status}` } }
            ];
        }
    }
   
    return User.findAndCountAll({
        where: {
            organisationId: orgId,
            id: { [Op.not]: userId },
            [Op.and]: whereCondition
        },
        distinct: true,
        limit: pageSize,
        offset: (pageNumber - 1) * pageSize,
        include: [{ 
            model: Role,
            where: (search.role && search.role !== '') ? { name: search.role } : {},
        }],
        order: [
            ['createdAt', 'DESC']
        ]
    }).then((data) => {
        if (data.length === 0) {
            cb(null, []);
        } else {
            const userData = data.rows;
            const users = userData.map((user) => {
                return {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    organisationId: user.organisationId,
                    phone: user.phone,
                    emailNotifications: user.emailNotifications,
                    textNotifications: user.textNotifications,
                    twoFactorAuth: user.twoFactorAuth,
                    status: user.status,
                    defaultCalender: user.defaultCalender,
                    role: user.Role.name
                };
            });
            cb(null, { data: users, count: data.count })
        }
    }) 
}

function getOrganisationId(userId, res, cb) {
    return User.findByPk(userId)
        .then((user) => {
            if (!user) {
                cb(sendErrorResponse(res, 404, 'User not found'));
            } else {
                cb(null, user.organisationId);
            }
        });
}

function deleteUser(id, res, cb) {
    return User.findByPk(id)
        .then((user) => {
            if (!user) {
                cb(sendErrorResponse(res, 404, 'User not found'));
            } else {
                return User.destroy({
                    where: {
                        id: id
                    }
                }).then(function (rowDeleted) {
                    if (rowDeleted === 1) {
                        cb(null, 'User deleted successfully');
                    }
                })
            }
        });
}

Promise.promisifyAll(module.exports);
