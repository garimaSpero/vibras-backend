const express = require('express');
const Auth = require('../../../middlewares/Auth');
const WarrantyController = require('../../../controllers/Organisation/Proposal/WarrantyController');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();
const { query } = require('express-validator');

router.get('/templates', Auth, WarrantyController.getWarrantyTemplates);

router.put('/', [
    query('id')
        .exists()
        .notEmpty()
        .withMessage('Warranty page id is required')

], Auth, WarrantyController.updateProposalWarranty);

module.exports =  router;