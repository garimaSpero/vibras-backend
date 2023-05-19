'use strict';

const { sendErrorResponse, sendSuccessResponse, sendPaginatedSuccessResponse } = require('../../utils/sendResponse');

let organisationService = require('../../services/Organisation/Organisation');

const { validationResult } = require('express-validator');

module.exports = {
    getRoles: getRoles,
};


function getRoles(req, res) {
    try {
        organisationService.getRolesAsync(res)
            .then((result) => {
                if (result) {
                    return sendSuccessResponse(res, 200, result, 'All Roles');
                }
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}
