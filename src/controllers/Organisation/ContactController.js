let contactService = require('../../services/Organisation/Contact');
const { sendErrorResponse, sendSuccessResponse, sendPaginatedSuccessResponse } = require('../../utils/sendResponse');

const { validationResult } = require('express-validator');

module.exports = {
    getContact: getContact,
    createContact: createContact,
    updateContact: updateContact,
    getContacts: getContacts,
    deleteContact: deleteContact
};

function getContact(req, res) {
    const contactId = req.query.contactId ? req.query.contactId : req.contactId;

    try {
        contactService.getContactAsync(contactId, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function createContact(req, res) {
    let userId = req.userId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        contactService.createContactAsync(userId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 201, result, 'Contact added successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function updateContact(req, res) {
    const contactId = req.query.contactId ? req.query.contactId : req.contactId;
    const userId = req.userId;
    try
     {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        contactService.updateContactAsync(userId, contactId, req.body, res)
            .then((result) => {
                if (result) {
                    return sendSuccessResponse(res, 200, result, 'Contact updated successfully');
                }
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function getContacts(req, res) {
    let organisationId = req.organisationId;
    try {
        const pageSize = parseInt(req.query.pageSize, 10) || 100;
        const page = parseInt(req.query.page, 10) || 1;

        contactService.getContactsAsync(organisationId, pageSize, page)
            .then((result) => {
                if (result) {
                    return sendPaginatedSuccessResponse(res, 200, result.data, 'Successful', result.count, page, pageSize);
                }
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function deleteContact(req, res) {
    const contactId = req.query.contactId ? req.query.contactId : req.contactId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        contactService.deleteContactAsync(contactId)
            .then((result) => {
                if (result) {
                    return sendSuccessResponse(res, 200, result, 'Contact deleted successfully');
                }
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}