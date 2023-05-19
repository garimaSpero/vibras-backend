'use strict';
let Promise = require('bluebird');
const crypto = require('crypto');
const model = require('../../models');
const sendErrorResponse = require("../../utils/sendResponse").sendErrorResponse;
const { User, CustomerType, CustomerPaymentType, LeadSource, Crew, AppointmentRequestDay, Organisation } = model;

module.exports = {
    getAppSettingsData: getAppSettingsData,
    getAppSettings: getAppSettings,
    updateAppSettings: updateAppSettings,
    createCustomerType : createCustomerType,
    createPaymentType: createPaymentType,
    createLeadSource: createLeadSource,
    createCrew: createCrew,
    createAppointmentDays: createAppointmentDays,
};

function getAppSettingsData(organisationId, res, cb) {
    return Organisation.findByPk(organisationId, { include: [CustomerType, CustomerPaymentType, Crew, LeadSource, AppointmentRequestDay] }).then((org) => {
        if (!org) {
            cb(sendErrorResponse(res, 404, 'Organisation not found'));
        }
        const customerTypes = org.CustomerTypes.map((customerType) => {
            return customerType.customerType;
        });
        const customerPaymentTypes = org.CustomerPaymentTypes.map((paymentType) => {
            return paymentType.paymentType;
        });
        const crews = org.Crews.map((name) => {
            return name.name;
        });
        const leadSources = org.LeadSources.map((leadSource) => {
            return leadSource.leadSource;
        });

        cb(null, {
            proposalColor: org.proposalColor,
            defaultCurrency: org.defaultCurrency,
            bccEmail: org.bccEmail,
            customerTypes: customerTypes,
            customerPayments: customerPaymentTypes,
            crews: crews,
            leadSources: leadSources,
            appointmentDays: org.AppointmentRequestDays,
        })
    })

}

function getAppSettings(userId, res, cb) {
    return User.findByPk(userId).then((user) => {
        if (!user) {
            cb(sendErrorResponse(res, 404, 'User not found'));
        }
        let organisationId = user.organisationId;
        return this.getAppSettingsDataAsync(organisationId, res).then((orgData) => {
            cb(null, orgData)
        });
    })
}

function updateAppSettings(userId, reqData, res, cb){
    return User.findByPk(userId).then((user) => {
        if(!user){
            cb(sendErrorResponse(res, 404, 'User not found'));
        }
        return user.organisationId;
    }).then((organisationId) => {
        if(reqData.customerTypes){
            return this.createCustomerTypeAsync(organisationId, reqData.customerTypes);
        } else {
            return organisationId;
        }
        
    }).then((organisationId) => {
        if (reqData.customerPayments) {
            return this.createPaymentTypeAsync(organisationId, reqData.customerPayments);
        } else {
            return organisationId;
        }
        
    }).then((organisationId) => {
        if (reqData.crews) {
            return this.createCrewAsync(organisationId, reqData.crews);
        } else {
            return organisationId;
        }
    }).then((organisationId) => {
        if (reqData.leadSources) {
            return this.createLeadSourceAsync(organisationId, reqData.leadSources);
        } else {
            return organisationId;
        }
    }).then((organisationId) => {
        if (reqData.appointmentDays) {
            return this.createAppointmentDaysAsync(organisationId, reqData.appointmentDays);
        } else {
            return organisationId;
        }
    }).then((organisationId) => {
        return Organisation.update({ defaultCurrency: reqData.defaultCurrency, bccEmail: reqData.bccEmail, proposalColor: reqData.proposalColor }, { where: { id: organisationId }}).then(() => {
            return this.getAppSettingsDataAsync(organisationId, res).then((orgData) => {
                cb(null, orgData)
            });
        }) 
    })
}

function createCustomerType(organisationId, data, cb) {
    const customerTypes = [];
    return CustomerType.destroy({
        where: {
            organisationId: organisationId
        }
    }).then(() => {
        data.forEach((type, index) => {
            customerTypes.push({
                id: crypto.randomUUID(),
                customerType: type,
                organisationId: organisationId
            });
        });
        return CustomerType.bulkCreate(customerTypes).then(() => {
            cb(null, organisationId )
        });
    })
}

function createPaymentType(organisationId, data, cb) {
    const customerPayments = [];
    return CustomerPaymentType.destroy({
        where: {
            organisationId: organisationId
        }
    }).then(() => {
        data.forEach((type, index) => {
            customerPayments.push({
                id: crypto.randomUUID(),
                paymentType: type,
                organisationId: organisationId
            });
        });
        return CustomerPaymentType.bulkCreate(customerPayments).then(() => {
            cb(null, organisationId)
        });
    })
}

function createLeadSource(organisationId, data, cb) {
    const leadSources = [];
    return LeadSource.destroy({
        where: {
            organisationId: organisationId
        }
    }).then(() => {
        data.forEach((type, index) => {
            leadSources.push({
                id: crypto.randomUUID(),
                leadSource: type,
                organisationId: organisationId
            });
        });
        return LeadSource.bulkCreate(leadSources).then(() => {
            cb(null, organisationId)
        });
    })
}

function createCrew(organisationId, data, cb) {
    const crews = [];
    return Crew.destroy({
        where: {
            organisationId: organisationId
        }
    }).then(() => {
        data.forEach((name, index) => {
            crews.push({
                id: crypto.randomUUID(),
                name: name,
                organisationId: organisationId
            });
        });
        return Crew.bulkCreate(crews).then(() => {
            cb(null, organisationId)
        });
    })
}

function createAppointmentDays(organisationId, data, cb) {
    return AppointmentRequestDay.destroy({
        where: {
            organisationId: organisationId
        }
    }).then(() => {
        data = {
            ...data,
            id: crypto.randomUUID(),
            organisationId: organisationId
        };
        return AppointmentRequestDay.create(data).then(() => {
            cb(null, organisationId)
        });
    })
} 

Promise.promisifyAll(module.exports);
