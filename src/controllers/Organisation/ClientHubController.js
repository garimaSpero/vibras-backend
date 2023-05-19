'use strict';

const { sendErrorResponse, sendSuccessResponse } = require('../../utils/sendResponse');

let clientHubService = require('../../services/Organisation/ClientHub');

const { validationResult } = require('express-validator');

module.exports = {
    getClientHubSettings: getClientHubSettings,
    updateClientHubSettings: updateClientHubSettings
};

function getClientHubSettings(req, res) {
    try {
        const userId = req.userId;
        clientHubService.getClientHubSettingsAsync(userId, res)
            .then((result) => {
                return sendSuccessResponse(res, 201, result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }

}

function updateClientHubSettings(req, res) {
    let userId = req.userId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        clientHubService.updateClientHubSettingsAsync(userId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result ,'Settings updated successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}
