const express = require('express');
const BookingFormController = require('../../controllers/Organisation/BookingFormController');
const Auth = require('../../middlewares/Auth');
const { check, query } = require('express-validator');

const bodyParser = require('body-parser');

const app = express();
app.disable("x-powered-by");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const validateIdQueryParam = [
    query('id')
        .exists()
        .withMessage('ID is required'),
];

const router = express.Router();

// Booking form setting route
router.get(`/setting`, Auth, BookingFormController.getBookingFormSetting);

router.get(`/setting/all`, Auth, BookingFormController.getBookingFormSettings);

router.post(`/setting`, [
    check('serviceDetailStatus').not().isEmpty().withMessage('Service detail status is required'),
    check('appointmentDateTimeStatus').not().isEmpty().withMessage('Appointment Datetime status is required')
], Auth, BookingFormController.addBookingFormSetting);

router.put(`/setting`, [
    check('serviceDetailStatus').not().isEmpty().withMessage('Service detail status is required'),
    check('appointmentDateTimeStatus').not().isEmpty().withMessage('Appointment Datetime status is required')
], validateIdQueryParam, Auth, BookingFormController.updateBookingFormSetting);

router.delete('/setting', validateIdQueryParam, Auth, BookingFormController.deleteBookingFormSetting);

// Booking form question route
router.get(`/question`, Auth, BookingFormController.getBookingFormQuestion);

router.get(`/question/all`, Auth, BookingFormController.getBookingFormQuestions);

router.post(`/question`, [
    check('isRequired').not().isEmpty().withMessage('isRequired status is required'),
    check('question').not().isEmpty().withMessage('Question is required'),
    check('answerType').not().isEmpty().withMessage('Answer type is required'),
], Auth, BookingFormController.addBookingFormQuestion);

router.put(`/question`, [
    check('isRequired').not().isEmpty().withMessage('isRequired status is required'),
    check('question').not().isEmpty().withMessage('Question is required'),
    check('answerType').not().isEmpty().withMessage('Answer type is required'),
], validateIdQueryParam, Auth, BookingFormController.updateBookingFormQuestion);

router.delete('/question', validateIdQueryParam, Auth, BookingFormController.deleteBookingFormQuestion);

// Booking form Answer route
router.get(`/answer`, Auth, BookingFormController.getBookingFormAnswer);

router.get(`/answer/all`, Auth, BookingFormController.getBookingFormAnswers);

router.post(`/answer`, [
    check('questionId').not().isEmpty().withMessage('Question id is required'),
    check('answer').not().isEmpty().withMessage('Answer is required'),
], Auth, BookingFormController.addBookingFormAnswer);

router.put(`/answer`, [
    check('questionId').not().isEmpty().withMessage('Question id is required'),
    check('answer').not().isEmpty().withMessage('Answer is required'),
], validateIdQueryParam, Auth, BookingFormController.updateBookingFormAnswer);

router.delete('/answer', validateIdQueryParam, Auth, BookingFormController.deleteBookingFormAnswer);

module.exports =  router;