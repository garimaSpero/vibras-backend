'use strict';

const { sendErrorResponse, sendSuccessResponse } = require('../../utils/sendResponse');

let eventTypeService = require('../../services/Organisation/EventType');

const { validationResult } = require('express-validator');

module.exports = {
    getEventTypes: getEventTypes,
    addEventType: addEventType,
    updateEventType: updateEventType,
    deleteEventType: deleteEventType
};

function getEventTypes(req, res) {
    let organisationId = req.organisationId;
    try {
        eventTypeService.getEventTypesAsync(organisationId, res)
            .then((result) => {
                
                return sendSuccessResponse(res, 200, {
                    eventTypes: result
                });
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function addEventType(req, res){
    let userId = req.userId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        eventTypeService.addEventTypeAsync(userId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, {
                    eventType: result
                });
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function updateEventType(req, res) {
    let eventTypeId = req.query.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        eventTypeService.updateEventTypeAsync(eventTypeId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, {
                    eventType: result
                },'Event type updated successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function deleteEventType(req, res) {
    let eventTypeId = req.query.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        eventTypeService.deleteEventTypeAsync(eventTypeId, res)
            .then((result) => {
                if (result) {
                    return sendSuccessResponse(res, 200, {}, result);
                }
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}