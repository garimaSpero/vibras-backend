const express = require('express');
const ContactController = require('../../controllers/Organisation/ContactController');
const Auth = require('../../middlewares/Auth');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();
const { check, query } = require('express-validator');
router.get('/', Auth, ContactController.getContact);
router.post('/create', [
    check('firstName').not().isEmpty().withMessage('First name is required'),
    check('email').isEmail().withMessage('Please enter a valid email address'),
    check('lastName').optional(),
    check('companyName').optional(),
    check('type').optional(),
    check('dealOwnerId').optional(),
    check('addresses').optional(),
    check('phone').not().isEmpty().withMessage('Phone number is required'),
    check('fax').optional(),
    check('emailNotifications').toBoolean(),
    check('isBusinessAccount').toBoolean(),
    check('outOfDrips').toBoolean(),

], Auth, ContactController.createContact);

router.put('/', [
    check('firstName').not().isEmpty().withMessage('First name is required'),
    check('lastName').optional(),
    check('companyName').optional(),
    check('type').optional(),
    check('dealOwnerId').optional(),
    check('addresses').optional(),
    check('fax').optional(),
    check('emailNotifications').toBoolean(),
    check('isBusinessAccount').toBoolean(),
    check('outOfDrips').toBoolean(),

], Auth, ContactController.updateContact);

router.get('/all', Auth, ContactController.getContacts);
router.delete('/', [
    query('contactId')
        .exists()
        .withMessage('contact id is required'),
], Auth, ContactController.deleteContact);

module.exports =  router;