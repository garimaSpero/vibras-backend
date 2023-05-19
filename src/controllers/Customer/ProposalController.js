'use strict';

const { sendErrorResponse, sendSuccessResponse } = require('../../utils/sendResponse');
let proposalService = require('../../services/Customer/Proposal');

const { validationResult } = require('express-validator');

module.exports = {
    acceptProposal: acceptProposal,
};

function acceptProposal(req, res) {
    
    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        proposalService.acceptProposalAsync(req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}
