const express = require('express');
const Auth = require('../../../middlewares/Auth');
const QuoteDetailController = require('../../../controllers/Organisation/Proposal/QuoteDetailController');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();
const { check, query } = require('express-validator');

router.get('/templates', Auth, QuoteDetailController.getQuoteDetailTemplates);

router.put('/', [
    query('id')
        .exists()
        .notEmpty()
        .withMessage('Quote detail page id is required')

], [
    check('pageTitle').not().isEmpty().withMessage('Page title is required'),
], Auth, QuoteDetailController.updateProposalQuoteDetail);

router.delete('/', [
    query('sectionId')
        .optional()
        .custom((value, { req }) => {
            if (!value && !req.query.itemId && !req.query.id) {
                throw new Error('At least one of Section id, Item id, or Page id is required');
            }
            return true;
        }),

    query('itemId')
        .optional()
        .custom((value, { req }) => {
            if (!value && !req.query.sectionId && !req.query.id) {
                throw new Error('At least one of Section id, Item id, or Page id is required');
            }
            return true;
        }),

    query('id')
        .optional()
        .custom((value, { req }) => {
            if (!value && !req.query.sectionId && !req.query.itemId) {
                throw new Error('At least one of Section id, Item id, or Page id is required');
            }
            return true;
        })
], Auth, QuoteDetailController.deleteSetionOrItem);


router.put('/update-status', [
    query('id')
        .exists()
        .notEmpty()
        .withMessage('Section id is required')

], [
    check('isActive').not().isEmpty().withMessage('Status is required'),
], Auth, QuoteDetailController.updateSectionState);

router.post('/', [
    check('proposalId').not().isEmpty().withMessage('Proposal id is required'),
], Auth, QuoteDetailController.createQuoteDetailPage);

router.post('/settings', [
    check('quoteDetailPageId').not().isEmpty().withMessage('Quote detail page id is required'),
], Auth, QuoteDetailController.savePageSettings);

router.get('/settings', [
    query('id')
        .exists()
        .notEmpty()
        .withMessage('Page id is required')
], Auth, QuoteDetailController.getPageSettings);
module.exports =  router;