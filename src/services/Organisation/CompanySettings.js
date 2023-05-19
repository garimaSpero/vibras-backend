'use strict';
let Promise = require('bluebird');
const crypto = require('crypto');
const model = require('../../models');
const sendErrorResponse = require("../../utils/sendResponse").sendErrorResponse;
const { User, Organisation, Addresses } = model;

module.exports = {
    getCompanySettings: getCompanySettings,
    getOrganisationId: getOrganisationId,
    updateCompanySettings: updateCompanySettings
};

function getCompanySettings(userId, res, cb) {
    return this.getOrganisationIdAsync(userId, res)
        .then((organisationId) => {
            return Organisation.findByPk(organisationId)
            .then((organisation) => {
                if (!organisation) {
                    cb(sendErrorResponse(res, 404, 'Organisation not found'));
                } else {
                    return Addresses.findAll({ where: { userId: userId, organisationId: organisationId } })
                    .then((address) => {
                        if (address)  {
                            cb(null, {
                                id: organisation.id,
                                companyNumber: organisation.companyNumber,
                                name: organisation.name,
                                shortName: organisation.shortName,
                                customerBookingLink: organisation.customerBookingLink,
                                phone: organisation.phone,
                                timeZone: organisation.timeZone,
                                licenseNumber: organisation.licenseNumber,
                                replyEmail: organisation.replyEmail,
                                taxRate: organisation.taxRate,
                                websiteUrl: organisation.websiteUrl,
                                reviewUrl: organisation.reviewUrl,
                                facebookUrl: organisation.facebookUrl,
                                instagramUrl: organisation.instagramUrl,
                                linkedinUrl: organisation.linkedinUrl,
                                twitterUrl: organisation.twitterUrl,
                                logo: organisation.logo,
                                addresses: address
                            })
                        }
                        
                    });                    
                }
            })
            
        }).catch((err) => { return 'error'; });
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

function updateCompanySettings(userId, reqData, res, cb) {
    return this.getOrganisationIdAsync(userId, res)
        .then((organisationId) => {
            return Organisation.findByPk(organisationId)
                .then((organisation) => {
                    if (!organisation) {
                        cb(sendErrorResponse(res, 404, 'Organisation not found'));
                    } else {
                        return Organisation.update({
                            name: reqData.name,
                            shortName: reqData.shortName,
                            customerBookingLink: reqData.customerBookingLink,
                            phone: reqData.phone,
                            timeZone: reqData.timeZone,
                            licenseNumber: reqData.licenseNumber,
                            replyEmail: reqData.replyEmail,
                            taxRate: reqData.taxRate,
                            websiteUrl: reqData.websiteUrl,
                            reviewUrl: reqData.reviewUrl,
                            facebookUrl: reqData.facebookUrl,
                            instagramUrl: reqData.instagramUrl,
                            linkedinUrl: reqData.linkedinUrl,
                            twitterUrl: reqData.twitterUrl,
                        }, {
                            where: { id: organisationId },
                        }).then((updated) => {
                            if (!updated) {
                                cb(null, sendErrorResponse(res, 400, 'Something went wrong'));
                            }
                            if (reqData.addresses) {
                                return Addresses.destroy({
                                    where: {
                                        OrganisationId: organisationId
                                    }
                                }).then(() => {
                                    const newAddress = reqData.addresses.map(v => ({ ...v, id: crypto.randomUUID(), userId: userId, organisationId: organisationId }));
                                    return Addresses.bulkCreate(newAddress)
                                })
                            }  
                        })
                    }
                }).then(() => {
                    Organisation.findByPk(organisationId, {
                        include: {
                            model: Addresses,
                            attributes: ['name', 'address', 'city', 'state', 'zip', 'addressType'],
                            as: 'addresses'
                        }}).then((org) => {
                        cb(null, {
                            id:org.id,
                            name: org.name,
                            shortName: org.shortName,
                            customerBookingLink: org.customerBookingLink,
                            phone: org.phone,
                            timeZone: org.timeZone,
                            licenseNumber: org.licenseNumber,
                            replyEmail: org.replyEmail,
                            taxRate: org.taxRate,
                            websiteUrl: org.websiteUrl,
                            reviewUrl: org.reviewUrl,
                            facebookUrl: org.facebookUrl,
                            instagramUrl: org.instagramUrl,
                            linkedinUrl: org.linkedinUrl,
                            twitterUrl: org.twitterUrl,
                            addresses: org.addresses,
                        })

                    })
                })

        }).catch((err) => { return 'error'; });
}


Promise.promisifyAll(module.exports);
