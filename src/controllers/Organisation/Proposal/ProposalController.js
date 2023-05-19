'use strict';

const { sendErrorResponse, sendSuccessResponse, sendPaginatedSuccessResponse } = require('../../../utils/sendResponse');
let proposalService = require('../../../services/Organisation/Proposal/Proposal');

const { validationResult } = require('express-validator');

module.exports = {
    getProposal:getProposal,
    createProposal: createProposal,
    updateProposal:updateProposal,
    deleteProposal:deleteProposal,
    getProposals: getProposals,
    getProposalTemplates: getProposalTemplates,
    uploadImage: uploadImage,
    saveAsTemplate: saveAsTemplate,
    changePageOrder: changePageOrder,
    getPdf: getPdf,
    sendPdf: sendPdf
};

function getProposal(req, res) {
    const proposalId = req.query.proposal_id ? req.query.proposal_id : req.proposal_id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        proposalService.getProposalAsync(proposalId, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function createProposal(req,res){
    let userId = req.userId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        proposalService.createProposalAsync(userId, req.body,res)
            .then((result) => {
                return sendSuccessResponse(res, 201, result, 'Proposal added successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function updateProposal(req,res){
    const proposalId = req.query.proposal_id ? req.query.proposal_id : req.proposal_id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        proposalService.updateProposalAsync(proposalId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 202, result, "Proposal updated successfully!");
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function deleteProposal(req,res){
    const proposalId = req.query.proposal_id ? req.query.proposal_id : req.proposal_id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        proposalService.deleteProposalAsync(proposalId, res)
            .then((result) => {
                if (result) return sendSuccessResponse(res, 200, {},"Proposal delete successfully!");
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function getProposals(req, res) {
    const organisationId = req.organisationId;
    const search = req.query;
    const pageSize = parseInt(req.query.pageSize, 10) || 100;
    const page = parseInt(req.query.page, 10) || 1;

    try {
        proposalService.getProposalsAsync(organisationId, pageSize, page, search, res)
            .then((result) => {
                return sendPaginatedSuccessResponse(res, 200, result.data, 'Successful', result.count, page, pageSize );
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function getProposalTemplates(req, res) {
    const organisationId = req.organisationId;
    const search = req.query;
    const pageSize = parseInt(req.query.pageSize, 10) || 100;
    const page = parseInt(req.query.page, 10) || 1;

    try {
        proposalService.getProposalTemplatesAsync(organisationId, pageSize, page, search, res)
            .then((result) => {
                return sendPaginatedSuccessResponse(res, 200, result.data, 'Successful', result.count, page, pageSize);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function uploadImage(req, res) {
    let fileName = '';

    try {
        if (!req.file) {
            return res.status(400).send({ message: 'Please upload a file.' });
        }
        fileName = req.file.location

        return sendSuccessResponse(res, 201, { fileName: fileName }, 'Image uploaded successfully');

    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function saveAsTemplate(req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        proposalService.saveAsTemplateAsync(req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 202, result, 'Saved as Template successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function changePageOrder(req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        proposalService.changePageOrderAsync(req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 202, result, 'Saved as Template successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function getPdf(req, res) {
    try {
        const errors = validationResult(req);
        const id = req.query.id ? req.query.id : req.id;
        const type = req.query.type ? req.query.type : req.type;

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        proposalService.getPdfAsync(id, type, res)
            .then((result) => {
                return sendSuccessResponse(res, 202, result, 'Pdf generated successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function sendPdf (req, res) {
    try {
        const errors = validationResult(req);
        const id = req.query.id ? req.query.id : req.id;

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        proposalService.sendPdfAsync(id, res)
            .then((result) => {
                return sendSuccessResponse(res, 202, result, 'Proposal sent successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}