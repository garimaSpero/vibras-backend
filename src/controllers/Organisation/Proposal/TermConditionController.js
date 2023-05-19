'use strict';

const { sendErrorResponse, sendSuccessResponse, sendPaginatedSuccessResponse } = require('../../../utils/sendResponse');
const proposalTermConditionService = require( "../../../services/Organisation/Proposal/ProposalTermCondition");

const { validationResult } = require('express-validator');

module.exports = {
    getTermConditionTemplates: getTermConditionTemplates,
    updateProposalTermCondition: updateProposalTermCondition
};

function getTermConditionTemplates(req, res) {
    const organisationId = req.organisationId || '';
    const search = req.query;
    const pageSize = parseInt(req.query.pageSize, 10) || 100;
    const page = parseInt(req.query.page, 10) || 1;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        proposalTermConditionService.getTermConditionTemplatesAsync(organisationId, pageSize, page, search, res)
            .then((result) => {
                return sendPaginatedSuccessResponse(res, 200, result.data, 'Successful', result.count, page, pageSize);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function updateProposalTermCondition(req, res) {
    const id = req.query.id || '';
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        
        proposalTermConditionService.updateProposalTermConditionAsync(id, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 202, result, "Proposal updated successfully");
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}