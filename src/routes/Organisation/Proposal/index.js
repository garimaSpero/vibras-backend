const express = require('express');
const proposalController = require('../../../controllers/Organisation/Proposal/ProposalController');
const titleRouter = require('./titleRouter');
const introductionRouter = require('./introductionRouter');
const quoteDetailRouter = require('./quoteDetailRouter');
const termConditionRouter = require('./termConditionRouter');
const warrantyRouter = require('./warrantyRouter');
const customPageRouter = require('./customPageRouter');
const Auth = require('../../../middlewares/Auth');

const upload = require('../../../middlewares/upload');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const { check, query } = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**************** Proposal Routes ******************/
router.post('/image', [Auth, upload.single('file')], proposalController.uploadImage);
router.get('/all', Auth, proposalController.getProposals);

router.get('/', proposalController.getProposal);
router.get('/templates', Auth, proposalController.getProposalTemplates);

router.post('/create', [
    check('name').not().optional(),
    check('contactId').optional(),
    check('proposalId').optional(),
],Auth, proposalController.createProposal);

router.put('/',[
    query('proposal_id')
    .exists()
    .notEmpty()
    .withMessage('Proposal id is required')
] ,Auth, proposalController.updateProposal);

router.delete('/',[
    query('proposal_id')
    .exists()
    .notEmpty()
    .withMessage('Proposal id is required')
], Auth, proposalController.deleteProposal);

router.post('/save-template', [
    check('id').not().isEmpty().withMessage('Id is required'),
    check('isTemplate').not().isEmpty().withMessage('Is Template is required'),
    check('type').not().isEmpty().withMessage('Type is required'),
], Auth, proposalController.saveAsTemplate);

router.post('/change-order', [
    check('pageOneId').not().isEmpty().withMessage('Page one id is required'),
    check('pageOneNo').not().isEmpty().withMessage('Page one no is required'),
    check('pageTwoId').not().isEmpty().withMessage('Page two id is required'),
    check('pageTwoNo').not().isEmpty().withMessage('Page two no is required'),
], Auth, proposalController.changePageOrder);

router.get('/pdf', proposalController.getPdf);
router.get('/send', Auth, proposalController.sendPdf);
/**************** Proposal Pages Routes ******************/
router.use('/title', titleRouter);
router.use('/introduction', introductionRouter);
router.use('/quote-detail', quoteDetailRouter);
router.use('/term-condition', termConditionRouter);
router.use('/warranty', warrantyRouter);
router.use('/custom-page', customPageRouter);

module.exports =  router;