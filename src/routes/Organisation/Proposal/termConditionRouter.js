const express = require('express');
const Auth = require('../../../middlewares/Auth');
const TermConditionController = require ('../../../controllers/Organisation/Proposal/TermConditionController');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();
const {check, query } = require('express-validator');

router.get('/templates', Auth, TermConditionController.getTermConditionTemplates);

router.put('/', [
    query('id')
        .exists()
        .notEmpty()
        .withMessage('Term and conditions page id is required')

], Auth, TermConditionController.updateProposalTermCondition);

module.exports =  router;