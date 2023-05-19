const express = require('express');
const ProductController = require('../../controllers/Organisation/ProductController');
const Auth = require('../../middlewares/Auth');
const { check, query } = require('express-validator');

const { upload, uploadImage } = require('../../middlewares/s3Upload');

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

router.get(`/`, Auth, ProductController.getProduct);

router.get(`/all`, Auth, ProductController.getProducts);
router.post(`/`, [
    check('categoryId').optional(),
    check('type').not().isEmpty().withMessage('Product type is required'),
    check('name').not().isEmpty().withMessage('Name is required'),
    check('sku').optional(),
    check('manufacturer').optional(),
    check('description').optional(),
    check('unitOfMeasure').optional(),
    check('image').optional(),
    check('isActive').optional(),
    check('isTaxable').optional(),
    check('requireQuantity').optional(),
    check('isInventory').optional(),
], Auth, ProductController.addProduct);

router.put(`/`, [
    check('type').not().isEmpty().withMessage('Product type is required'),
    check('name').not().isEmpty().withMessage('Name is required'),
    check('sku').optional(),
    check('manufacturer').optional(),
    check('description').optional(),
    check('unitOfMeasure').optional(),
    check('image').optional(),
    check('isActive').optional(),
    check('isTaxable').not().optional(),
    check('requireQuantity').optional(),
    check('isInventory').optional(),
], validateIdQueryParam, Auth, ProductController.updateProduct);

router.get(`/notes`, validateIdQueryParam, Auth, ProductController.getProductNotes);
router.post(`/note`, [
    check('productId').not().isEmpty().withMessage('Product Id is required'),
    check('note').not().isEmpty().withMessage('Product note is required'),
], Auth, ProductController.addProductNote);

router.delete('/note', validateIdQueryParam, Auth, ProductController.deleteProductNote);

router.delete('/', validateIdQueryParam, Auth, ProductController.deleteProduct);

router.post('/image', Auth, upload.single('file'), uploadImage, ProductController.saveNoteImage);

module.exports =  router;