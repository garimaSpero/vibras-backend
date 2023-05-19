'use strict';

const { sendErrorResponse, sendSuccessResponse, sendPaginatedSuccessResponse } = require('../../utils/sendResponse');

let documentService = require('../../services/Organisation/Document');

const { validationResult } = require('express-validator');

module.exports = {
    saveDocument: saveDocument,
    listAllDocuments: listAllDocuments,
    getDocument: getDocument,
    deleteDocument: deleteDocument
};

function saveDocument(req, res) {
    let fileName = '';
    const organisationId = req.organisationId;
    
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'Please upload a file.' });
        }
        fileName = req.file.location
        console.log('URL',fileName);
        const segments = fileName.split('/');

        const objectName = segments[segments.length - 1];
        console.log('objectName',objectName);
        documentService.saveDocumentAsync(organisationId, fileName, objectName, res).then((result) => {
            if (result) {
                return sendSuccessResponse(res, 201, result, 'Document uploaded sussessfully');
            }
        });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function listAllDocuments(req, res) {
    const organisationId = req.organisationId;
    const pageSize = parseInt(req.query.pageSize, 10) || 100;
    const page = parseInt(req.query.page, 10) || 1;
    try {
        documentService.listAllDocumentsAsync(organisationId, pageSize, page, res).then((result) => {
            if (result) {
                return sendPaginatedSuccessResponse(res, 200, result.data, 'Successful', result.count, page, pageSize);
            }
        });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function getDocument(req, res) {
    let id = req.query.id;
    try {
        documentService.getDocumentAsync(id, res).then((result) => {
            if (result) {
                return sendSuccessResponse(res, 200, result, 'Successfull');
            }
        });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function deleteDocument(req, res) {
    let id = req.query.id;
    try {
        documentService.deleteDocumentAsync(id, res).then((result) => {
            if (result) {
                return sendSuccessResponse(res, 200, result, 'Successfull');
            }
        });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}


