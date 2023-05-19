
'use strict';
const Promise = require('bluebird');
const crypto = require('crypto');
const model = require('../../models');
const { sendErrorResponse } = require("../../utils/sendResponse");

const { User, ColorCode, Appointment, OrganisationEventType, Contact } = model;

module.exports = {
    getAppointments: getAppointments,
    getAppointment: getAppointment,
    addAppointment: addAppointment,
    updateAppointment: updateAppointment,
    deleteAppointment: deleteAppointment,
};

function getAppointments(userId, res, cb) {
    return User.findByPk(userId).then((user) => {
        if (!user) {
            cb(sendErrorResponse(res, 404, 'Appointment not found'));
        }
        return Appointment.findAll({
            where: { userId: userId }, include: [ColorCode, OrganisationEventType, User, Contact], order: [
                ['createdAt', 'DESC']
            ]}).then((all) => {
            if (all) {
                cb(null, all);
            }
        })
    })
}

function getAppointment(id, res, cb) {
    return Appointment.findByPk(id, { include: [ColorCode, OrganisationEventType, User, Contact] }).then((product) => {
        if (!product) {
            cb(sendErrorResponse(res, 404, 'Appointment not found'));
        } else {
            cb(null, product)
        }
    })
}

async function addAppointment(userId, reqData, res, cb) {
    const user = await User.findByPk(userId);
    const colorCode = await ColorCode.findByPk(reqData?.colorCodeId);
    const eventType = await OrganisationEventType.findByPk(reqData?.eventTypeId);
    const contact = await Contact.findByPk(reqData?.contactId);

    if (!user) cb(sendErrorResponse(res, 404, 'User not found'));
    if (!colorCode) cb(sendErrorResponse(res, 404, 'Color code not found'));
    if (!eventType) cb(sendErrorResponse(res, 404, 'Event type not found'));
    if (!contact) cb(sendErrorResponse(res, 404, 'Contact not found'));

    if (user && colorCode && eventType) {
        const appointment = await Appointment.create({
            id: crypto.randomUUID(),
            organisationId: user.organisationId,
            colorCodeId: reqData.colorCodeId,
            eventTypeId: reqData.eventTypeId,
            assignedTo: userId,
            contactId: reqData.contactId,
            appointmentDate: reqData.appointmentDate,
            appointmentDetails: reqData.appointmentDetails,
            eventDuration: reqData.eventDuration,
        });

        if (appointment) {
            cb(null, appointment);
        } else {
            cb(sendErrorResponse(res, 401, 'Something went wrong'));
        }
    } else {
        cb(sendErrorResponse(res, 401, 'Something went wrong'));
    }
}

async function updateAppointment(appointmentId, reqData, res, cb) {
    const appointment = await Appointment.findByPk(appointmentId);
    const colorCode = await ColorCode.findByPk(reqData?.colorCodeId);
    const eventType = await OrganisationEventType.findByPk(reqData?.eventTypeId);
    const contact = await Contact.findByPk(reqData?.contactId);
    
    if (!appointment) cb(sendErrorResponse(res, 404, 'Appointment not found'));
    if (!colorCode) cb(sendErrorResponse(res, 404, 'Color code not found'));
    if (!eventType) cb(sendErrorResponse(res, 404, 'Event type not found'));
    if (!contact) cb(sendErrorResponse(res, 404, 'Contact not found'));

    if (colorCode && eventType && appointment) {
        const updateAppoointment = await Appointment.update({
            colorCodeId: reqData.colorCodeId,
            eventTypeId: reqData.eventTypeId,
            contactId: reqData.contactId,
            appointmentDate: reqData.appointmentDate,
            appointmentDetails: reqData.appointmentDetails,
            eventDuration: reqData.eventDuration,
        }, { where: { id: appointmentId } })

        if (updateAppoointment) {
            const appointment = await Appointment.findByPk(appointmentId);
            cb(null, appointment);
        } else {
            cb(sendErrorResponse(res, 401, 'Something went wrong'));
        }
    } else {
        cb(sendErrorResponse(res, 401, 'Something went wrong'));
    }
}

function deleteAppointment(appointmentId, res, cb) {
    return Appointment.findByPk(appointmentId).then((product) => {
        if (!product) {
            cb(sendErrorResponse(res, 404, 'Appointment not found'));
        } else {
            return Appointment.destroy({
                where: {
                    id: appointmentId
                }
            }).then(function (rowDeleted) {
                if (rowDeleted === 1) {
                    cb(null, 'Appointment deleted successfully');
                }
            })
        }
    });
}

Promise.promisifyAll(module.exports);
