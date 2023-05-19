const express = require('express');
const Auth = require('../../../middlewares/Auth');
const TitleController = require('../../../controllers/Organisation/Proposal/TitleController');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();
const { check, query } = require('express-validator');

// ProposalTitles Routes

router.get('/templates', Auth, TitleController.getTitleTemplates);

router.get('/', [
    query('proposal_id')
        .exists()
        .notEmpty()
        .withMessage('Proposal id is required'),
    query('proposal_title_id')
        .exists()
        .notEmpty()
        .withMessage('Proposal Title id is required')
        
], Auth, TitleController.getProposalTitle);

router.put('/', [
    query('id')
        .exists()
        .notEmpty()
        .withMessage('Title page id is required')
        
], Auth, TitleController.updateProposalTitle);

module.exports =  router;