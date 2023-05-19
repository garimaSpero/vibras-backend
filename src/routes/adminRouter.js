const express = require('express');
const IndustryController = require('../controllers/Admin/IndustryController');
const EmailTemplateController = require('../controllers/Admin/EmailTemplateController.js');
const ColorController = require('../controllers/Admin/ColorController.js');
const router = express.Router();

router.get('/industries', IndustryController.getIndustries);
router.get('/email-templates', EmailTemplateController.getEmailTemplates);
router.get('/colors', ColorController.getColors);

module.exports = router;
