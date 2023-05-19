const express = require('express');
const ProposalController = require('../../controllers/Customer/ProposalController');
const Auth = require('../../middlewares/Auth');
const { check, query } = require('express-validator');

const bodyParser = require('body-parser');
const upload = require('../../middlewares/upload');

const app = express();
app.disable("x-powered-by");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const router = express.Router();

router.post('/accept', ProposalController.acceptProposal);

module.exports = router;