const express = require('express');
const EventTypeController = require('../../controllers/Organisation/EventTypeController');
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

router.get(`/all`, Auth, EventTypeController.getEventTypes);
router.post(`/`, [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('color').not().isEmpty().withMessage('Color is required'),
    check('colorCode').not().isEmpty().withMessage('Color code is required'),
    check('duration').isInt().withMessage('duration is required'),
    check('parentId').optional(),
], Auth, EventTypeController.addEventType);

router.put(`/`, [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('color').not().isEmpty().withMessage('Color is required'),
    check('colorCode').not().isEmpty().withMessage('Color code is required'),
    check('duration').isInt().withMessage('duration is required'),
    check('parentId').optional(),
], validateIdQueryParam, Auth, EventTypeController.updateEventType);

router.delete('/', validateIdQueryParam, Auth, EventTypeController.deleteEventType);

module.exports =  router;