const express = require('express');
const Auth = require('../../../middlewares/Auth');
const CustomPageController = require('../../../controllers/Organisation/Proposal/ProposalCustomPageController');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();
const { check, query } = require('express-validator');

router.post('/', [
    check('proposalId').not().isEmpty().withMessage('Proposal id is required'),
], Auth, CustomPageController.createProposalCustomPage);

router.put('/', [
    query('id')
        .exists()
        .notEmpty()
        .withMessage('Page id is required')

], Auth, CustomPageController.updateProposalCustomPage);

router.delete('/', [
    query('id')
        .exists()
        .withMessage('Page id is required'),
], Auth, CustomPageController.deleteCustomPage);

module.exports = router;