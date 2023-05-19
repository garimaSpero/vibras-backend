const express = require('express');
const DocumentController = require('../../controllers/Organisation/DocumentController');
const Auth = require('../../middlewares/Auth');

const uploadOrganisationDoc = require('../../middlewares/uploadOrganisationDoc');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();
const { check, query } = require('express-validator');

const validateIdQueryParam = [
    query('id')
        .exists()
        .withMessage('ID is required'),
];


router.get(`/`, validateIdQueryParam, Auth, DocumentController.getDocument);

router.get(`/all`, Auth, DocumentController.listAllDocuments);

router.post('/', [
    check('file').not().isEmpty().withMessage('File is required'),
], [ Auth, uploadOrganisationDoc.single('file') ], DocumentController.saveDocument);

router.delete('/', validateIdQueryParam, Auth, DocumentController.deleteDocument);

module.exports = router;