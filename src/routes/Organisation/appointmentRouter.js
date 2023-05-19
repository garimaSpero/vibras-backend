const express = require('express');
const AppointmentController = require ('../../controllers/Organisation/AppointmentController');
const Auth = require('../../middlewares/Auth');
const { check, query } = require('express-validator');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const validateIdQueryParam = [
    query('id')
        .exists()
        .withMessage('ID is required'),
];

const router = express.Router();

router.get(`/`, Auth, AppointmentController.getAppointment);

router.get(`/all`, Auth, AppointmentController.getAppointments);

router.post(`/`, [
    check('colorCodeId').not().isEmpty().withMessage('Color Id is required'),
    check('eventTypeId').not().isEmpty().withMessage('Event type Id is required'),
    check('contactId').not().isEmpty().withMessage('Contact Id is required'),
    check('appointmentDate').not().isEmpty().withMessage('Appointment date is required'),
    check('eventDuration').not().isEmpty().withMessage('Event Duration is required'),
    check('appointmentDetails').not().isEmpty().withMessage('Appointment Detail is required'),
], Auth, AppointmentController.addAppointment);

router.put(`/`, [
    check('colorCodeId').not().isEmpty().withMessage('Color Id is required'),
    check('eventTypeId').not().isEmpty().withMessage('Event type Id is required'),
    check('contactId').not().isEmpty().withMessage('Contact Id is required'),
    check('appointmentDate').not().isEmpty().withMessage('Appointment date is required'),
    check('eventDuration').not().isEmpty().withMessage('Event Duration is required'),
    check('appointmentDetails').not().isEmpty().withMessage('Appointment Detail is required'),
], validateIdQueryParam, Auth, AppointmentController.updateAppointment);

router.delete('/', validateIdQueryParam, Auth, AppointmentController.deleteAppointment);

module.exports =  router;