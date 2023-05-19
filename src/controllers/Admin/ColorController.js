'use strict';

const { sendErrorResponse, sendSuccessResponse } = require('../../utils/sendResponse');

let colorService = require('../../services/Admin/Color');

module.exports = {
    getColors: getColors,
};

function getColors(req, res) {
    try {
        colorService.getColorsAsync()
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'All Industries');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }

}


