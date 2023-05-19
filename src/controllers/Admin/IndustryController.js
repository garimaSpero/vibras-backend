'use strict';

const { sendErrorResponse, sendSuccessResponse } = require("../../utils/sendResponse");
let industryService = require('../../services/Admin/Industry');

module.exports = {
    getIndustries: getIndustries,
};

function getIndustries(req, res) {
    try {
        industryService.getIndustriesAsync()
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'All Industries');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}
