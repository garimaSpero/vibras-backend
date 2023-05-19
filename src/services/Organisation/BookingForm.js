'use strict';
let Promise = require('bluebird');
const crypto = require('crypto');
const model = require('../../models');
const sendErrorResponse = require("../../utils/sendResponse").sendErrorResponse;
const { User, BookingFormSetting, BookingFormAnswer, BookingFormQuestion, Organisation } = model;

module.exports = {
    // Booking form setting
    getBookingFormSetting: getBookingFormSetting,
    updateBookingFormSetting: updateBookingFormSetting,
    addBookingFormSetting: addBookingFormSetting,
    deleteBookingFormSetting: deleteBookingFormSetting,
    getBookingFormSettings: getBookingFormSettings,

    // Booking form question
    getBookingFormQuestion: getBookingFormQuestion,
    updateBookingFormQuestion: updateBookingFormQuestion,
    addBookingFormQuestion: addBookingFormQuestion,
    deleteBookingFormQuestion: deleteBookingFormQuestion,
    getBookingFormQuestions: getBookingFormQuestions,

    // Booking form Answer
    getBookingFormAnswer: getBookingFormAnswer,
    getBookingFormAnswers: getBookingFormAnswers,
    addBookingFormAnswer: addBookingFormAnswer,
    updateBookingFormAnswer: updateBookingFormAnswer,
    deleteBookingFormAnswer: deleteBookingFormAnswer
};

/*******************Get Booking form Setting */
function getBookingFormSetting(id, res, cb) {
    return BookingFormSetting.findByPk(id).then((product) => {
        if (!product) {
            cb(sendErrorResponse(res, 404, 'Booking setting not found'));
        } else {
            cb(null, product)
        }
    })
}

/*******************Get All Booking form Setting */
function getBookingFormSettings(userId, res, cb) {
    return User.findByPk(userId).then((user) => {
        if (!user) {
            cb(sendErrorResponse(res, 404, 'User not found'));
        }
        let organisationId = user.organisationId;
        return BookingFormSetting.findAll({ where: { organisationId: organisationId } }).then((all) => {
            if (all) {
                cb(null, all);
            }
        })
    })
}

/*******************Create Booking form Setting */
async function addBookingFormSetting(userId, reqData, res, cb) {
    const user = await User.findByPk(userId);

    if (!user) cb(sendErrorResponse(res, 404, 'User not found'));
    const bookingFormSetting = await BookingFormSetting.findOne({ where: { organisationId: user.organisationId }});
    
    if (bookingFormSetting) cb(sendErrorResponse(res, 400, 'Setting already exists'));

    if (user) {
        let organisationId = user.organisationId;
        const bookingForm = await BookingFormSetting.create({
            id: crypto.randomUUID(),
            organisationId: organisationId,
            serviceDetailStatus: reqData.serviceDetailStatus,
            appointmentDateTimeStatus: reqData.appointmentDateTimeStatus,
        })
        cb(null, bookingForm);
    } else {
        cb(sendErrorResponse(res, 404, 'Something went wrong'))
    }
}

/*******************Update Booking form Setting */
async function updateBookingFormSetting(bookingFormSettingId, reqData, res, cb) {
    const bookingFormSetting = await BookingFormSetting.findByPk(bookingFormSettingId);

    if (!bookingFormSetting) cb(sendErrorResponse(res, 404, 'Booking form setting not found'));

    if (bookingFormSetting) {
        const bookingForm = await BookingFormSetting.update({
            serviceDetailStatus: reqData.serviceDetailStatus,
            appointmentDateTimeStatus: reqData.appointmentDateTimeStatus,
        }, { where: { id: bookingFormSettingId } });

        if (bookingForm) {
            const updatedbookingFormSetting = await BookingFormSetting.findByPk(bookingFormSettingId);
            cb(null, updatedbookingFormSetting);
        }
    } else {
        cb(sendErrorResponse(res, 404, 'Something went wrong'))
    }
}

/*******************Delete Booking form Setting */
function deleteBookingFormSetting(bookingFormSettingId, res, cb) {
    return BookingFormSetting.findByPk(bookingFormSettingId)
        .then((product) => {
            if (!product) {
                cb(sendErrorResponse(res, 404, 'Booking form setting not found'));
            } else {
                return BookingFormSetting.destroy({
                    where: {
                        id: bookingFormSettingId
                    }
                }).then(function (rowDeleted) {
                    if (rowDeleted === 1) {
                        cb(null, 'Booking form setting deleted successfully');
                    }
                })
            }
        });
}

/*******************Get Booking form question */
function getBookingFormQuestion(id, res, cb) {
    return BookingFormQuestion.findByPk(id, { include: [BookingFormAnswer] }).then((product) => {
        if (!product) {
            cb(sendErrorResponse(res, 404, 'Booking question not found'));
        } else {
            cb(null, product)
        }
    })
}

/*******************Get All Booking form question */
function getBookingFormQuestions(userId, res, cb) {
    return User.findByPk(userId).then((user) => {
        if (!user) {
            cb(sendErrorResponse(res, 404, 'User not found'));
        }
        let organisationId = user.organisationId;
        return BookingFormQuestion.findAll({ where: { organisationId: organisationId }, include: [BookingFormAnswer] }).then((all) => {
            if (all) {
                cb(null, all);
            }
        })
    })
}

/*******************Add Booking form question */
async function addBookingFormQuestion(userId, reqData, res, cb) {
    const user = await User.findByPk(userId);

    if (!user) cb(sendErrorResponse(res, 404, 'User not found'));

    if (user) {
        let organisationId = user.organisationId;
        const bookingForm = await BookingFormQuestion.create({
            id: crypto.randomUUID(),
            organisationId: organisationId,
            isRequired: reqData.isRequired,
            question: reqData.question,
            answerType: reqData.answerType,
        })

        if (reqData.answerType == 'short_answer') {
            cb(null, bookingForm);
        } else {
            const reqAnswer = reqData.answerOption.map(ele => ({ ...ele, id: crypto.randomUUID(), questionId: bookingForm.id }))
            const answerResult = await addBookingFormAnswer(userId, reqAnswer, res);
            cb(null, { bookingForm, answerResult });
        }

    } else {
        cb(sendErrorResponse(res, 404, 'Something went wrong'))
    }
}

/*******************Update Booking form question */
async function updateBookingFormQuestion(BookingFormQuestionId, reqData, res, cb) {
    const bookingFormQuestion = await BookingFormQuestion.findByPk(BookingFormQuestionId);

    if (!bookingFormQuestion) cb(sendErrorResponse(res, 404, 'Booking form question not found'));

    if (bookingFormQuestion) {
        const bookingForm = await BookingFormQuestion.update({
            isRequired: reqData.isRequired,
            question: reqData.question,
            answerType: reqData.answerType,
        }, { where: { id: BookingFormQuestionId } });

        if (bookingForm) {
            if (reqData.answerType == "short_answer") {
                const updatedBookingFormQuestion = await BookingFormQuestion.findByPk(BookingFormQuestionId);
                cb(null, updatedBookingFormQuestion);
            } else {
                const reqAnswer = reqData.answerOption;
                const updatebookingFormAnswer = await updateBookingFormAnswer(BookingFormQuestionId, reqAnswer, res);
                if (updatebookingFormAnswer) {
                    const updatedBookingFormQuestion = await BookingFormQuestion.findByPk(BookingFormQuestionId, { include: [BookingFormAnswer] });
                    cb(null, updatedBookingFormQuestion);
                }
            }

        }
    } else {
        cb(sendErrorResponse(res, 404, 'Something went wrong'))
    }
}

/*******************Delete Booking form question */
function deleteBookingFormQuestion(BookingFormQuestionId, res, cb) {
    return BookingFormQuestion.findByPk(BookingFormQuestionId)
        .then((product) => {
            if (!product) {
                cb(sendErrorResponse(res, 404, 'Booking form question not found'));
            } else {
                return BookingFormQuestion.destroy({
                    where: {
                        id: BookingFormQuestionId
                    }
                }).then(function (rowDeleted) {
                    if (rowDeleted === 1) {
                        cb(null, 'Booking form question deleted successfully');
                    }
                })
            }
        });
}

/*******************Get Booking form Answer */
function getBookingFormAnswer(id, res, cb) {
    return BookingFormAnswer.findByPk(id, { include: [BookingFormQuestion] }).then((product) => {
        if (!product) {
            cb(sendErrorResponse(res, 404, 'Booking Answer not found'));
        } else {
            cb(null, product)
        }
    })
}

/*******************Get All Booking form Answer */
function getBookingFormAnswers(userId, res, cb) {
    return User.findByPk(userId).then((user) => {
        if (!user) {
            cb(sendErrorResponse(res, 404, 'User not found'));
        }
        return BookingFormAnswer.findAll({ include: [BookingFormQuestion] }).then((all) => {
            if (all) {
                cb(null, all);
            }
        })
    })
}

/*******************Add Booking form Answer */
async function addBookingFormAnswer(userId, reqData, res, cb) {
    const user = await User.findByPk(userId);
    if (!user) cb(sendErrorResponse(res, 404, 'User not found'));

    if (user) {
        const bookingFrom = await BookingFormAnswer.bulkCreate(reqData)
        return bookingFrom;
    } else {
        cb(sendErrorResponse(res, 404, 'Something went wrong'))
    }
}

/*******************Update Booking form Answer */
async function updateBookingFormAnswer(BookingFormAnswerId, reqData, res, cb) {
    const bookingQuestion = await BookingFormQuestion.findByPk(BookingFormAnswerId);
    if (bookingQuestion) {
        const bookingFrom = await BookingFormAnswer.bulkCreate(reqData, { updateOnDuplicate: ["answer"] })
        return bookingFrom;
    } else {
        cb(sendErrorResponse(res, 404, 'Something went wrong'))
    }
}

/*******************Delete Booking form Answer */
function deleteBookingFormAnswer(BookingFormAnswerId, res, cb) {
    return BookingFormAnswer.findByPk(BookingFormAnswerId)
        .then((product) => {
            if (!product) {
                cb(sendErrorResponse(res, 404, 'Booking form Answer not found'));
            } else {
                return BookingFormAnswer.destroy({
                    where: {
                        id: BookingFormAnswerId
                    }
                }).then(function (rowDeleted) {
                    if (rowDeleted === 1) {
                        cb(null, 'Booking form Answer deleted successfully');
                    }
                })
            }
    });
}


Promise.promisifyAll(module.exports);
