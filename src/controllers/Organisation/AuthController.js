'use strict';

const { sendErrorResponse, sendSuccessResponse } = require('../../utils/sendResponse');

let authService = require('../../services/Organisation/Auth');

const { validationResult } = require('express-validator');

module.exports = {
    signUp: signUp,
    login: login,
    resetPassword: resetPassword,
    verify: verify,
};

function signUp(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        authService.signUpAsync(req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 201, result,'Account created successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }

}

function login(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        authService.loginAsync(req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'Login successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function resetPassword(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        authService.resetPasswordAsync(req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, [], result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

function verify(req, res) {
    try {
        const userId =  req.query.userId;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        authService.verifyAsync(userId, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'Email verified successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}


