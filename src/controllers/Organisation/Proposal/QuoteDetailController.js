'use strict';

const { sendErrorResponse, sendSuccessResponse } = require('../../../utils/sendResponse');
const proposalQuoteDetailService = require("../../../services/Organisation/Proposal/ProposalQuoteDetail");

const { validationResult } = require('express-validator');

module.exports = {
    getQuoteDetailTemplates: getQuoteDetailTemplates,
    updateProposalQuoteDetail: updateProposalQuoteDetail,
    deleteSetionOrItem: deleteSetionOrItem,
    updateSectionState: updateSectionState,
    createQuoteDetailPage: createQuoteDetailPage,
    savePageSettings: savePageSettings,
    getPageSettings: getPageSettings
};

function getQuoteDetailTemplates(req, res) {
    const organisationId = req.organisationId || '';
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        
        proposalQuoteDetailService.getQuoteDetailTemplatesAsync(organisationId, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function updateProposalQuoteDetail(req, res) {
    const id = req.query.id || '';
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        proposalQuoteDetailService.updateProposalQuoteDetailAsync(id, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 202, result, "Proposal updated successfully");
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function deleteSetionOrItem(req, res){
    const sectionId = req.query.sectionId;
    const itemId = req.query.itemId;
    const pageId = req.query.id;

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        proposalQuoteDetailService.deleteSetionOrItemAsync(sectionId, itemId, pageId, res)
            .then((result) => {
                if (result) {
                    return sendSuccessResponse(res, 200, {}, result);
                }
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
} 

function updateSectionState(req, res) {
    const sectionId = req.query.id;
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        proposalQuoteDetailService.updateSectionStateAsync(sectionId, req.body, res)
            .then((result) => {
                if (result) {
                    return sendSuccessResponse(res, 200, {}, result);
                }
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function createQuoteDetailPage(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        proposalQuoteDetailService.createQuoteDetailPageAsync(req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 202, result, "Proposal updated successfully");
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    } 
}
function savePageSettings(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        proposalQuoteDetailService.savePageSettingsAsync(req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 202, result, "Settings updated successfully");
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    } 
}

function getPageSettings(req, res) {
    try {
        const id = req.query.id;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        proposalQuoteDetailService.getPageSettingsAsync(id, res)
            .then((result) => {
                return sendSuccessResponse(res, 202, result, "Settings updated successfully");
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    } 

}