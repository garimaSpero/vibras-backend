const express = require('express');
const CompanySettingsController = require('../../controllers/Organisation/CompanySettingsController');
const Auth = require('../../middlewares/Auth');

const { check } = require('express-validator');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

router.put(`/`, [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('shortName').not().isEmpty().withMessage('Short name name is required'),
    check('customerBookingLink').optional(),
    check('timeZone').optional(),
    check('licenseNumber').optional(),
    check('replyEmail').optional(),
    check('taxRate').optional(),
    check('websiteUrl').optional(),
    check('reviewUrl').optional(),
    check('facebookUrl').optional(),
    check('instagramUrl').optional(),
    check('linkedinUrl').optional(),
    check('twitterUrl').optional(),
    check('addresses').optional(),
], Auth, CompanySettingsController.updateCompanySettings);

router.get(`/`, Auth, CompanySettingsController.getCompanySettings);
module.exports =  router;