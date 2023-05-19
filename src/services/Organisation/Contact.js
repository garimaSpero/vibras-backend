'use strict';
let Promise = require('bluebird');
const { Op } = require('sequelize');
const crypto = require('crypto');
const model = require('../../models');
const sendErrorResponse = require("../../utils/sendResponse").sendErrorResponse;
const { User, Contact, ContactAddresses } = model;
const { randomInt } = require('crypto');

module.exports = {
    getContacts: getContacts,
    getContact: getContact,
    createContact: createContact,
    saveContactAddresses: saveContactAddresses,
    updateContact: updateContact,
    deleteContact: deleteContact,
};

function getContacts(organisationId, limit, page, cb) {
    let offset = (page - 1) * limit;

    return Contact.findAndCountAll({
        where: { organisationId: organisationId },
        include: [
            {
                model: ContactAddresses,
                attributes: ['name', 'address', 'city', 'state', 'zip', 'addressType'],
                as: 'addresses'
            },
            {
                model: User,
                as: 'salesPerson',
                attributes: ['firstName', 'lastName']
            }
        ],
        distinct: true,
        limit: limit,
        offset: (page - 1) * limit,
        subQuery: false,
        order:[
            ['createdAt', 'DESC']
        ]
    }).then((data) => {
        if (data.length === 0) {
            cb(null, []);
        } else {
            cb(null, { data: data.rows, count: data.count })
        }
    })
}

function getContact(contactId, res, cb) {
    return Contact.findOne({
        where: { id: contactId }, include: [ {
            model: ContactAddresses,
            attributes: ['name', 'address', 'city', 'state', 'zip', 'addressType'],
            as: 'addresses',
        }, {
            model: User,
            as: 'salesPerson',
            attributes: ['firstName', 'lastName']
        }]
    }).then((contact) => {
        if (!contact) {
            cb(null, sendErrorResponse(res, 404, 'No Contact found'));
        } else {
            cb(null, contact);
        }
    });
}

function createContact(userId, reqData, res, cb) {
    return User.findByPk(userId)
        .then((user) => {
            let phone = reqData.phone;
            let email = reqData.email;
            return Contact.findOne({ where: { [Op.or]: [{ phone }, { email }] } })
                .then((contactExists) => {
                    if (contactExists) {
                        cb(null, sendErrorResponse(res, 422, 'Contact with that email or phone already exists'));
                    } else {
                        const rand = randomInt(0, 1000000);
                        const contactNumber = "Contact #" + rand;
                        
                        return Contact.create({
                            id: crypto.randomUUID(),
                            organisationId: user.organisationId,
                            firstName: reqData.firstName,
                            lastName: reqData.lastName,
                            contactNumber: contactNumber,
                            companyName: reqData.companyName,
                            email: reqData.email,
                            phone: reqData.phone,
                            fax: reqData.fax,
                            type: reqData.type,
                            website: reqData.website,
                            leadSource: reqData.leadSource,
                            dealOwnerId: reqData.dealOwnerId,
                            emailNotifications: reqData.emailNotifications,
                            isActive: reqData.isActive,
                            isBusinessAccount: reqData.isBusinessAccount,
                            userId: user.id
                        }).then((addedContact) => {
                            if (!addedContact) {
                                cb(null, sendErrorResponse(res, 400, 'Something went wrong'));
                            } else {
                                if (reqData.addresses) {
                                    this.saveContactAddressesAsync(reqData.addresses, addedContact.id, user.organisationId)
                                }
                                cb(null, addedContact);
                            }
                        })
                    }
                })
        });
}

function saveContactAddresses(addresses, contactId, organisationId, cb) {
    
    return ContactAddresses.destroy({
        where: {
            contactId: contactId
        }
    }).then(() => {
        const newAddress = addresses.map(v => ({ ...v, id: crypto.randomUUID(), contactId: contactId, organisationId: organisationId }));
        
        return ContactAddresses.bulkCreate(newAddress)
            .then((addressess) => {
                if (!addressess) {
                    cb(null, "Something went wrong");
                } else {
                    cb(null, contactId);
                }
            });
    })

}

function updateContact(userId,contactId, reqData, res, cb) {
    return User.findByPk(userId)
    .then((user) => {
    return Contact.findByPk(contactId)
        .then((contact) => {
            if (!contact) {
                cb(null, sendErrorResponse(res, 404, 'Contact not found'))
            }
            return Contact.update({
                firstName: reqData.firstName,
                lastName: reqData.lastName,
                companyName: reqData.companyName,
                fax: reqData.fax,
                type: reqData.type,
                website: reqData.website,
                leadSource: reqData.leadSource,
                dealOwnerId: reqData.dealOwnerId,
                emailNotifications: reqData.emailNotifications,
                isActive: reqData.isActive,
                isBusinessAccount: reqData.isBusinessAccount
            }, {
                where: { id: contact.id }
            }).then((updatedContact) => {
                if (!updatedContact) {
                    cb(null, sendErrorResponse(res, 400, 'Something went wrong'));
                }
                
                return contact.id;
            }).then((contactId) => {
                if (reqData.addresses) {
                   return this.saveContactAddressesAsync(reqData.addresses, contactId, user.organisationId);
                } else {
                    return contactId  
                } 
               
            }).then(() => {
                cb(null, 'Success')
            })
        })
    });
}

function deleteContact(contactId, cb) {
    return Contact.findOne({ where: { id: contactId } })
        .then((contact) => {
            if (!contact) {
                cb(null, sendErrorResponse(res, 404, 'No Contact found'));
            } else {
                return Contact.destroy({
                    where: {
                        id: contact.id
                    }
                }).then(function (deleteContact) {
                    if (deleteContact === 1) {
                        cb(null, contact.id);
                    }
                })
            }
        });
}

Promise.promisifyAll(module.exports);