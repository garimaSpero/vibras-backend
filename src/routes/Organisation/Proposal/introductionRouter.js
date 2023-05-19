const express = require('express');
const Auth = require('../../../middlewares/Auth');
const IntroductionController = require('../../../controllers/Organisation/Proposal/IntroductionController');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();
const { check, query } = require('express-validator');

router.get('/templates', Auth, IntroductionController.getIntroductionTemplates);

router.put('/', [
    query('id')
        .exists()
        .notEmpty()
        .withMessage('Introduction page id is required')

], Auth, IntroductionController.updateProposalIntroduction);

module.exports =  router;