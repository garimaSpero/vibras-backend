'use strict';
const { Op } = require('sequelize');

let Promise = require('bluebird');
const crypto = require('crypto');
const model = require('../../models');
const sendErrorResponse = require("../../utils/sendResponse").sendErrorResponse;
const { User, OrganisationEventType, EventType, Organisation } = model;

module.exports = {
    getEventTypes: getEventTypes,
    addEventType: addEventType,
    updateEventType: updateEventType,
    deleteEventType: deleteEventType
};

function getEventTypes(organisationId, res, cb) {
    return Organisation.findByPk(organisationId).then((organisation) => {
        if (!organisation) {
            cb(sendErrorResponse(res, 404, 'Organisation not found'));
        }
        return OrganisationEventType.findAll({ where: { organisationId: organisationId }, include: EventType }).then((all) => {
            if(all.length == 0){
                return EventType.findAll().then((allEvent) => {
                    const organisationEventType = allEvent.map(obj => ({ id: crypto.randomUUID(), organisationId: organisationId, name: obj.name, color: obj.color, colorCode: obj.colorCode, duration: obj.duration, parentId: obj.id  }));

                    return OrganisationEventType.bulkCreate(organisationEventType).then(() => {
                        return OrganisationEventType.findAll({
                            where: { organisationId: organisationId },
                            include: EventType}).then((added) => {
                            const orgEventTypeData = added.map(obj => ({
                                id: obj.id,
                                name: obj.name,
                                color: obj.color,
                                colorCode: obj.colorCode,
                                duration: obj.duration,
                                parentId: obj.parentId,
                                isCalendar: obj.EventType?.isCalendar ?? null,
                                isDefault: obj.EventType?.isDefault ?? null
                            }));
                            cb(null, orgEventTypeData);
                        })
                    })
                })
            } else {
                const orgEventTypeData = all.map(obj => ({
                    id: obj.id,
                    name: obj.name,
                    color: obj.color,
                    colorCode: obj.colorCode,
                    duration: obj.duration,
                    parentId: obj.parentId,
                    isCalendar: obj.EventType?.isCalendar ?? null,
                    isDefault: obj.EventType?.isDefault ?? null
                }));
                cb(null, orgEventTypeData);
            }
        })
    })
}

function addEventType(userId, reqData, res, cb) {
    return User.findByPk(userId).then((user) => {
        if (!user) {
            cb(sendErrorResponse(res, 404, 'User not found'));
        }
        let organisationId = user.organisationId;

        return OrganisationEventType.findOne({ where: { name: reqData.name, organisationId: organisationId } }).then((eventType) => {
            if (eventType) {
                cb(sendErrorResponse(res, 400, 'Event type already exists'));
            } else {
                return OrganisationEventType.create({
                    id: crypto.randomUUID(),
                    organisationId: organisationId,
                    name: reqData.name,
                    color: reqData.color,
                    colorCode: reqData.colorCode,
                    duration: reqData.duration,
                }).then((added) => {
                    cb(null, {
                        id: added.id,
                        name: added.name,
                        color: added.color,
                        colorCode: added.colorCode,
                        duration: added.duration,
                    });
                })
            }
        })
    })  
}

function updateEventType(eventTypeId, reqData, res, cb) {
    return OrganisationEventType.findByPk(eventTypeId).then((eventType) => {
        if (!eventType) {
            cb(sendErrorResponse(res, 404, 'Event type not found'));
        } else {
            return OrganisationEventType.findOne({
                where: {
                    [Op.and]: [{ organisationId: eventType.organisationId }, { name: reqData.name }, { id: {
                        [Op.ne]: eventTypeId
                    } } ]}}).then((exists) => {
                if(exists){
                    cb(sendErrorResponse(res, 400, 'Event name already exists'));
                }else{
                    return OrganisationEventType.update({
                        name: reqData.name,
                        color: reqData.color,
                        duration: reqData.duration,
                        colorCode: reqData.colorCode,

                    }, { where: { id: eventType.id } }).then((updated) => {
                        return eventType.id;
                    })
                }
            })
            
        }
        
    }).then((eventTypeId) => {
        return OrganisationEventType.findByPk(eventTypeId).then((eventType) => {
            cb(null, eventType);
        })
    })
}

function deleteEventType(eventTypeId, res, cb){
    return OrganisationEventType.findByPk(eventTypeId)
        .then((eventType) => {
            if (!eventType) {
                cb(sendErrorResponse(res, 404, 'Event type not found'));
            } else {
                return OrganisationEventType.destroy({
                    where: {
                        id: eventTypeId
                    }
                }).then(function (rowDeleted) {
                    if (rowDeleted === 1) {
                        cb(null, 'Event type deleted successfully');
                    }
                })
            }
        });
}


Promise.promisifyAll(module.exports);
