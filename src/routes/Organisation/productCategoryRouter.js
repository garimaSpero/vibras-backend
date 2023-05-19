const express = require('express');
const ProductCategoryController = require('../../controllers/Organisation/ProductCategoryController');
const Auth = require('../../middlewares/Auth');
const { check, query } = require('express-validator');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const validateIdQueryParam = [
    query('id')
        .exists()
        .withMessage('ID is required'),
];

const router = express.Router();

router.get(`/`, Auth, ProductCategoryController.getProductCategory);

router.get(`/all`, Auth, ProductCategoryController.getProductCategories);
router.post(`/`, [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('measure').optional(),
], Auth, ProductCategoryController.addProductCategory);

router.put(`/`, [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('measure').optional()
], validateIdQueryParam, Auth, ProductCategoryController.updateProductCategory);

router.delete('/', validateIdQueryParam, Auth, ProductCategoryController.deleteProductCategory);

module.exports =  router;