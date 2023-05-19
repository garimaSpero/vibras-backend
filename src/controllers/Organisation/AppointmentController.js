'use strict';

const { sendErrorResponse, sendSuccessResponse } = require('../../utils/sendResponse');

let appointmentService = require('../../services/Organisation/Appointment');

const { validationResult } = require('express-validator');

module.exports = {
    getAppointments: getAppointments,
    getAppointment: getAppointment,
    addAppointment: addAppointment,
    updateAppointment: updateAppointment,
    deleteAppointment: deleteAppointment,
};

function getAppointments(req, res) {
    let userId = req.userId;
    try {
        appointmentService.getAppointmentsAsync(userId, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function getAppointment(req, res) {
    let id = req.query.id;
    try {
        appointmentService.getAppointmentAsync(id, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function addAppointment(req, res) {
    let userId = req.userId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        appointmentService.addAppointmentAsync(userId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'Appointment added successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function updateAppointment(req, res) {
    let productId = req.query.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        appointmentService.updateAppointmentAsync(productId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'Appointment updated successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function deleteAppointment(req, res) {
    let appointmentId = req.query.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        appointmentService.deleteAppointmentAsync(appointmentId, res)
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