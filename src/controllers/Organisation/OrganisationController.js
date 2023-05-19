'use strict';
const { sendErrorResponse, sendSuccessResponse } = require('../../utils/sendResponse');

let organisationService = require('../../services/Organisation/Organisation');

const { validationResult } = require('express-validator');

module.exports = {
    getProfile: getProfile,
    updateProfile: updateProfile,
    uploadLogo: uploadLogo,
    uploadProfileImage: uploadProfileImage,
    uploadDoc: uploadDoc
};

function getProfile(req, res) {
    let userId = req.userId;
    try {
        organisationService.getProfileAsync(userId, res)
        .then((result) => {
            return sendSuccessResponse(res, 200, {
                organisation: result
            });
        });  
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function updateProfile(req, res) {
    const userId = req.userId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        organisationService.updateProfileAsync(userId, req.body, res)
        .then((result) => {
            return sendSuccessResponse(res, 200, {
                organisation: result
            },'Profile updated successfully');
        }); 
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
    
}

function uploadLogo(req, res) {
    const userId = req.userId;
    
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'Please upload a file.' });
        }
       
        organisationService.uploadLogoAsync(userId, req, res)
            .then((result) => {
                sendSuccessResponse(res, 201, result, 'Logo uploaded successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
    
}

function uploadProfileImage(req, res) {
    const userId = req.userId;
    let fileName = '';
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'Please upload a file.' });
        }
        fileName = req.file.location
        
        organisationService.uploadProfileImageAsync(userId, req, res)
        .then((result) => {
            sendSuccessResponse(res, 201, result, 'Image uploaded successfully');
        });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function uploadDoc(req, res) {
    let fileName = '';
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'Please upload a file.' });
        }
        fileName = req.file.location
        sendSuccessResponse(res, 201, {
            file: fileName
        }, 'Logo uploaded successfully');
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }

}


