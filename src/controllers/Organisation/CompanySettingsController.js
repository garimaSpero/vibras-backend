'use strict';

const { sendErrorResponse, sendSuccessResponse } = require('../../utils/sendResponse');

let companySettingsService = require('../../services/Organisation/CompanySettings');

const { validationResult } = require('express-validator');

module.exports = {
    getCompanySettings: getCompanySettings,
    updateCompanySettings: updateCompanySettings
};

function getCompanySettings(req, res) {
    let userId = req.userId;
    try {
        companySettingsService.getCompanySettingsAsync(userId, res)
        .then((result) => {
            return sendSuccessResponse(res, 201, {
                organisation: result
            });
        });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
    
}

function updateCompanySettings(req, res) {
    let userId = req.userId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        companySettingsService.updateCompanySettingsAsync(userId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, {
                    organisation: result
                },'Company settings updated successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}


