'use strict';

const { sendErrorResponse, sendSuccessResponse } = require('../../utils/sendResponse');

let appSettingsService = require('../../services/Organisation/AppSettings');

const { validationResult } = require('express-validator');

module.exports = {
    getAppSettings: getAppSettings,
    updateAppSettings: updateAppSettings,
};

function getAppSettings(req, res) {
    let userId = req.userId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        appSettingsService.getAppSettingsAsync(userId,  res)
            .then((result) => {
                return sendSuccessResponse(res, 200, {
                    organisation: result
                });
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function updateAppSettings(req, res) {
    let userId = req.userId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        appSettingsService.updateAppSettingsAsync(userId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, {
                    organisation: result
                }, 'Settings updated successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}