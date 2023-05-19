'use strict';
let Promise = require('bluebird');
const model = require('../../models');
const { sendErrorResponse, sendSuccessResponse } = require('../../utils/sendResponse');
const { Op } = require('sequelize');
const crypto = require('crypto');
const { User, Organisation, Addresses, Role } = model;
const { deleteS3Object } = require('../../utils/s3Utils');

module.exports = {
    getProfile: getProfile,
    updateProfile: updateProfile,
    uploadLogo: uploadLogo,
    uploadProfileImage: uploadProfileImage,
    getRoles: getRoles
};


function getProfile(userId, res, cb) {
    return User.findByPk(userId, {
        include: [Organisation, {
            model: Addresses,
            attributes: ['name', 'address', 'city', 'state', 'zip', 'addressType'],
            as: 'addresses'
        }] })
        .then((user) => {
            if(!user){
               cb(null,sendErrorResponse(res, 404, 'User not found'));
            }else{
                cb(null, {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profileImage: user.profileImage,
                    companyNumber: user.Organisation.companyNumber,
                    phone: user.phone,
                    defaultCalender: user.defaultCalender,
                    emailNotifications: user.emailNotifications,
                    textNotifications: user.textNotifications,
                    twoFactorAuth: user.twoFactorAuth,
                    addresses: user.addresses,
                    signature: user.signature,
                });
            } 
        }).catch((err) => { 
            cb(null, sendErrorResponse(res, 500, 'Could not perform operation at this time, kindly try again later.', err))
        });
}

function updateProfile(userId, reqData, res, cb){
    return User.findByPk(userId).then((user) => {
        if(!user){
            cb(null, sendErrorResponse(res, 404, 'User not found'));
        }else{
            return User.update({
                    firstName: reqData.firstName,
                    lastName: reqData.lastName,
                    phone: reqData.phone,
                    emailNotifications: reqData.emailNotifications,
                    textNotifications: reqData.textNotifications,
                    twoFactorAuth: reqData.twoFactorAuth,
                    defaultCalender: reqData.defaultCalender,
                    signature: reqData.signature
                },{
                    where: { id: userId },
                }
            ).then((updatedUser) => {
                if (!updatedUser) {
                    cb(null, sendErrorResponse(res, 400, 'Something went wrong'));
                } else {
                    if (reqData.addresses.length) {
                        return Addresses.destroy({
                            where: {
                                userId: userId
                            }
                        }).then(() => {
                            const newAddress = reqData.addresses.map(v => ({ ...v, id: crypto.randomUUID(), userId: userId, organisationId: user.organisationId }));
                            return Addresses.bulkCreate(newAddress);
                        })
                    }
                } 
            }).then(() => {
                return User.findByPk(userId, {
                    include: [Organisation, {
                        model: Addresses,
                        attributes: ['name', 'address', 'city', 'state', 'zip', 'addressType'],
                        as: 'addresses'
                    }] })
                    .then((user) => {
                        cb(null, sendSuccessResponse(res, 200, {
                            organisation: {
                                id: user.id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                                phone: user.phone,
                                emailNotifications: user.emailNotifications,
                                textNotifications: user.textNotifications,
                                twoFactorAuth: user.twoFactorAuth,
                                defaultCalender: user.defaultCalender,
                                signature: user.signature,
                                organisationId: user.Organisation.id,
                                addresses: user.addresses
                            },
                        }, 'Profile updated successfully'));
                    });
            })
        }
    })
}

function uploadLogo(userId, reqData, res, cb){
    return User.findByPk(userId).then((user) => {
        console.log('user',user);
        return Organisation.findByPk(user.organisationId)
        .then((org) => {
            if (!org){
                cb(null, sendErrorResponse(res, 404, 'Organisation not found'));
            }else{
                const existingLogo = Organisation.logo;
                return Organisation.update({ 
                    logo: reqData.originalUrl,
                    logoThumbnail: reqData.resizedUrl
                },{
                    where: { id: user.organisationId },
                }).then((updated) => {
                    if (!updated) {
                        cb(null, sendErrorResponse(res, 400, 'Something went wrong'));
                    } else {
                        if (existingLogo){
                            deleteS3Object(existingLogo);
                        }
                       
                        cb(null, {
                            logo: reqData.originalUrl,
                            logoThumbnail: reqData.resizedUrl
                        });
                    }
                });
            }

        })

    })
}

function uploadProfileImage(userId, reqData, res, cb){
    return User.update({
        profileImage: reqData.originalUrl,
        profileImageThumbnail: reqData.resizedUrl
        },{
        where: { id: userId },
    }).then((user) => {
        if (!user) {
            cb(null, sendErrorResponse(res, 400, 'Something went wrong'));
        }else{
            cb(null, {
                logo: reqData.originalUrl,
                logoThumbnail: reqData.resizedUrl
            });
        }
    });
}

function getRoles(res, cb) {
    Role.findAll({
        where: {
            name: {
                [Op.not]: 'Super Admin'
            }
        },
        order: [['id', 'ASC']]
    }).then(roles => {
        cb(null, roles);
    }).catch(error => {
        console.error(error);
    });
}

Promise.promisifyAll(module.exports);
