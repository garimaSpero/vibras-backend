'use strict';

const { sendErrorResponse, sendSuccessResponse } = require('../../../utils/sendResponse');
const proposalCustomPageService = require("../../../services/Organisation/Proposal/ProposalCustomPage");
const { validationResult } = require('express-validator');

module.exports = {
    createProposalCustomPage: createProposalCustomPage,
    updateProposalCustomPage: updateProposalCustomPage,
    deleteCustomPage: deleteCustomPage
};

function createProposalCustomPage(req, res){
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        proposalCustomPageService.createProposalCustomPageAsync(req.body, res).then((result) => {
            return sendSuccessResponse(res, 201, result);
        });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function updateProposalCustomPage(req, res) {
    const pageId = req.query.id ? req.query.id : req.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        proposalCustomPageService.updateProposalCustomPageAsync(pageId, req.body, res).then((result) => {
            return sendSuccessResponse(res, 202, result, "Proposal updated successfully");
        });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function deleteCustomPage(req, res) {
    const pageId = req.query.id ? req.query.id : req.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        proposalCustomPageService.deleteCustomPageAsync(pageId, res).then((result) => {
            return sendSuccessResponse(res, 200, result, "Page deleted successfully");
        });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}