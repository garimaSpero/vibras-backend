'use strict';

const { sendErrorResponse, sendSuccessResponse } = require('../../utils/sendResponse');

let bookingFormService = require('../../services/Organisation/BookingForm');

const { validationResult } = require('express-validator');

module.exports = {
    // Booking form setting
    getBookingFormSettings: getBookingFormSettings,
    getBookingFormSetting: getBookingFormSetting,
    updateBookingFormSetting: updateBookingFormSetting,
    addBookingFormSetting: addBookingFormSetting,
    deleteBookingFormSetting: deleteBookingFormSetting,

    // Booking form question
    getBookingFormQuestion:getBookingFormQuestion,
    getBookingFormQuestions:getBookingFormQuestions,
    addBookingFormQuestion:addBookingFormQuestion,
    updateBookingFormQuestion:updateBookingFormQuestion,
    deleteBookingFormQuestion:deleteBookingFormQuestion,

    // Booking form answer
    getBookingFormAnswer:getBookingFormAnswer,
    getBookingFormAnswers:getBookingFormAnswers,
    addBookingFormAnswer:addBookingFormAnswer,
    updateBookingFormAnswer:updateBookingFormAnswer,
    deleteBookingFormAnswer:deleteBookingFormAnswer
};

/**************** Get Booking Form Setting By id */
function getBookingFormSetting(req, res) {
    let id = req.query.id;
    try {
        bookingFormService.getBookingFormSettingAsync(id, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

/**************** Get All Booking Form Setting */
function getBookingFormSettings(req, res) {
    let userId = req.userId;
    try {
        bookingFormService.getBookingFormSettingsAsync(userId, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

/**************** Create Booking Form Setting */
function addBookingFormSetting(req, res) {
    let userId = req.userId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        bookingFormService.addBookingFormSettingAsync(userId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'Booking form setting added successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

/**************** Update Booking Form Setting */
function updateBookingFormSetting(req, res) {
    let bookingFormSettingId = req.query.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        bookingFormService.updateBookingFormSettingAsync(bookingFormSettingId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'Booking from setting updated successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

/**************** Delete Booking Form Setting */
function deleteBookingFormSetting(req, res) {
    let productId = req.query.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        bookingFormService.deleteBookingFormSettingAsync(productId, res)
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

/**************** Get Booking Form Question By id */
function getBookingFormQuestion(req, res) {
    let id = req.query.id;
    try {
        bookingFormService.getBookingFormQuestionAsync(id, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

/**************** Get All Booking Form Question */
function getBookingFormQuestions(req, res) {
    let userId = req.userId;
    try {
        bookingFormService.getBookingFormQuestionsAsync(userId, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

/**************** Create Booking Form Question */
function addBookingFormQuestion(req, res) {
    let userId = req.userId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        bookingFormService.addBookingFormQuestionAsync(userId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'Booking form question added successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

/**************** Update Booking Form Question */
function updateBookingFormQuestion(req, res) {
    let bookingFormSettingId = req.query.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        bookingFormService.updateBookingFormQuestionAsync(bookingFormSettingId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'Booking from setting updated successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

/**************** Delete Booking Form Question */
function deleteBookingFormQuestion(req, res) {
    let productId = req.query.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        bookingFormService.deleteBookingFormQuestionAsync(productId, res)
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

/**************** Get Booking Form Answer By id */
function getBookingFormAnswer(req, res) {
    let id = req.query.id;
    try {
        bookingFormService.getBookingFormAnswerAsync(id, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

/**************** Get All Booking Form Answer */
function getBookingFormAnswers(req, res) {
    let userId = req.userId;
    try {
        bookingFormService.getBookingFormAnswersAsync(userId, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result);
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

/**************** Create Booking Form Answer */
function addBookingFormAnswer(req, res) {
    let userId = req.userId;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        bookingFormService.addBookingFormAnswerAsync(userId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'Booking form Answer added successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

/**************** Update Booking Form Answer */
function updateBookingFormAnswer(req, res) {
    let bookingFormSettingId = req.query.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        bookingFormService.updateBookingFormAnswerAsync(bookingFormSettingId, req.body, res)
            .then((result) => {
                return sendSuccessResponse(res, 200, result, 'Booking from setting updated successfully');
            });
    } catch (e) {
        console.error(e);
        return sendErrorResponse(res, 500, 'Server error, contact admin to resolve issue', e);
    }
}

/**************** Delete Booking Form Answer */
function deleteBookingFormAnswer(req, res) {
    let productId = req.query.id;
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        bookingFormService.deleteBookingFormAnswerAsync(productId, res)
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