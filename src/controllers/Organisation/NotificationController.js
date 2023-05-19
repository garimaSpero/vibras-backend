'use strict';

const { sendErrorResponse, sendSuccessResponse } = require('../../utils/sendResponse');

let notificationService = require('../../services/Organisation/Notification');

const { validationResult } = require('express-validator');

module.exports = {
    getNotifications: getNotifications,
    updateNotification: updateNotification
};

function getNotifications(req, res) {
    let userId = req.userId;
    try {
        notificationService.getNotificationsAsync(userId, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function updateNotification(req, res) {
    let userId = req.userId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        notificationService.updateNotificationAsync(userId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'Notifications updated successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}
