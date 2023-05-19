'use strict';

const { sendErrorResponse, sendSuccessResponse, sendPaginatedSuccessResponse } = require('../../../utils/sendResponse');
const proposalTitleService = require("../../../services/Organisation/Proposal/ProposalTitle");

const { validationResult } = require('express-validator');

module.exports = {
    getTitleTemplates: getTitleTemplates,
    getProposalTitle:getProposalTitle,
    updateProposalTitle:updateProposalTitle
};

function getTitleTemplates(req, res){
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
        proposalTitleService.getTitleTemplatesAsync(organisationId, pageSize, page, search, res)
            .then((result) => {
                return sendPaginatedSuccessResponse(res, 200, result.data, 'Successful', result.count, page, pageSize);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function getProposalTitle(req,res){
    const proposalId = req.query.proposal_id ? req.query.proposal_id : req.proposal_id;
    const proposal_title_id = req.query.proposal_title_id ? req.query.proposal_title_id : req.proposal_title_id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        proposalTitleService.getProposalTitleAsync(proposalId, proposal_title_id, res)
            .then((result) => {
                return sendSuccessResponse(res, 201, {
                    proposalTitle: result
                });
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function updateProposalTitle(req,res){
    const proposalTitleId = req.query.id || '';
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        // res.send(req.body)
        proposalTitleService.updateProposalTitleAsync(proposalTitleId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 202, result, "Proposal updated successfully");
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}