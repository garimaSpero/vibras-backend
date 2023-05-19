'use strict';

const { sendErrorResponse, sendSuccessResponse } = require('../../utils/sendResponse');

let emailTemplateService = require('../../services/Admin/EmailTemplate');

module.exports = {
    getEmailTemplates: getEmailTemplates,
};

function getEmailTemplates(req, res) {
    try {
        emailTemplateService.getEmailTemplatesAsync()
            .then((result) => {
                return sendSuccessResponse(res, 200, result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }

}


