'use strict';

const { sendErrorResponse, sendSuccessResponse, sendPaginatedSuccessResponse } = require('../../utils/sendResponse');

let userService = require('../../services/Organisation/User');

const { validationResult } = require('express-validator');

module.exports = {
    getUsers: getUsers,
    getUser: getUser,
    createUser: createUser,
    updateUser: updateUser,
    changePassword: changePassword,
    logout: logout,
    getUserAttachments: getUserAttachments,
    saveAttachments: saveAttachments,
    deleteAttachment: deleteAttachment,
    getUserNotes: getUserNotes,
    createNote: createNote,
    deleteUserNote: deleteUserNote,
    deleteUser: deleteUser
};


function getUsers(req, res) {
    const userId = req.userId;
    const organisationId = req.query.organisationId ?? null;

    const pageSize = parseInt(req.query.pageSize, 10) || 100;
    const page = parseInt(req.query.page, 10) || 1;
    const search = req.query;

    try {
        userService.getUsersAsync(userId, organisationId, pageSize, page, search, res)
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

function getUser(req, res) {
    const userId = req.query.userId ? req.query.userId : req.userId;
    const loggedinUser = req.userId;
    try {
        userService.getUserAsync(loggedinUser, userId, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, { user: result });
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function createUser(req, res) {
    let userId = req.userId;
    try {
        userService.createUserAsync(userId, req.body, res)
        .then((result) => {
            return sendSuccessResponse(res, 201, {
                user: result
            }, 'User added successfully');
        });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function updateUser(req, res) {
    const userId = req.query.userId ? req.query.userId : req.userId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        userService.updateUserAsync(userId, req.body, res)
            .then((result) => {
                if (result) {
                    return sendSuccessResponse(res, 200, { user: result }, 'User updated successfully');
                }
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function changePassword(req, res) {
    const userId = req.userId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        userService.changePasswordAsync(userId, req.body, res)
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

function logout(req, res) {
    const userId = req.userId;
    try {
        userService.logoutAsync(userId, res)
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

function getUserNotes(req, res) {
    const userId = req.query.userId;
    try{
        userService.getUserNotesAsync(userId, res).then((result) => {
            if (result) return sendSuccessResponse(res, 200, { notes: result });
        })
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function createNote(req, res) {
    try {
        userService.createNoteAsync(req.body, res)
            .then((result) => {
                if (result) {
                    return sendSuccessResponse(res, 200, { note: result }, 'Note created successfully');
                }
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function deleteUserNote(req, res) {
    const noteId = req.query.noteId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        userService.deleteUserNoteAsync(noteId, res)
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

function getUserAttachments(req, res){
    const userId = req.query.userId;
    try {
        userService.getUserAttachmentsAsync(userId, res).then((result) => {
            if (result) return sendSuccessResponse(res, 200, { attachments: result });
        })
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function saveAttachments(req, res) {
    let fileName = '';

    try {
        if (!req.file) {
            return res.status(400).send({ message: 'Please upload a file.' });
        }
        fileName = req.file.location

        userService.saveAttachment(req.body.userId, fileName, res)
            .then((result) => {
                if (result) {
                    return sendSuccessResponse(res, 201, { attachment: result }, 'Attachment uploaded sussessfully');
                }
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function deleteAttachment(req, res) {
    const attachmentId = req.query.attachmentId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        
        userService.deleteAttachmentAsync(attachmentId, res)
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

function deleteUser(req, res) {
    const id = req.query.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        userService.deleteUserAsync(id, res)
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

