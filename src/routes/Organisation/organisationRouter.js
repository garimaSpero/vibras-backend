const express = require('express');
const RoleController = require('../../controllers/Organisation/RoleController');
const UserController = require('../../controllers/Organisation/UserController');
const AuthController = require('../../controllers/Organisation/AuthController');
const AppSettingsController = require('../../controllers/Organisation/AppSettingsController');
const OrganisationController = require('../../controllers/Organisation/OrganisationController');
const NotificationController = require('../../controllers/Organisation/NotificationController');
const ClientHubController = require('../../controllers/Organisation/ClientHubController');

const Auth = require('../../middlewares/Auth');

const { upload, uploadImage } = require('../../middlewares/s3Upload'); 
const uploadDoc = require('../../middlewares/uploadDoc');
const { check, query } = require('express-validator');

const validateIdQueryParam = [
    query('id')
        .exists()
        .withMessage('ID is required'),
];
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();

router.get('/roles', RoleController.getRoles);

router.post('/signup', [
        check('firstName').not().isEmpty().withMessage('First name is required'),
        check('lastName').not().isEmpty().withMessage('Last name is required'),
        check('businessName').not().isEmpty().withMessage('Business name is required'),
        check('email').isEmail().withMessage('Please enter a valid email address'),
        check('password').isLength({ min: 6 }),
        check('industryId').not().isEmpty().withMessage('Industry id is required'),
        check('employee').not().isEmpty().withMessage('No. of employee is required'),
        check('phone').not().isEmpty().withMessage('Phone is required'),
        check('source').not().isEmpty().withMessage('Source is required'),
], AuthController.signUp);

router.post('/login', [
    check('email').not().isEmpty().withMessage('Email is required'),
    check('password').not().isEmpty().withMessage('Password is required'),
], AuthController.login );

router.get('/verify', [
    query('userId')
        .exists()
        .withMessage('User id is required'),
], AuthController.verify);

router.post('/change-password', [
    check('password').not().isEmpty().withMessage('Password is required'),
    check('newPassword').not().isEmpty().withMessage('New password is required'),
], Auth, UserController.changePassword);

router.post('/password-reset', [
    check('email').not().isEmpty().withMessage('Email is required'), 
], AuthController.resetPassword);


router.get('/logout', Auth, UserController.logout);

router.get(`/my-profile`, Auth, OrganisationController.getProfile);

router.put('/update-profile', [
    check('firstName').not().isEmpty().withMessage('First name is required'),
    check('lastName').optional(),
    check('addresses').optional(),
    check('phone').not().isEmpty().withMessage('Phone name is required'),
    check('defaultCalender').optional(),
    check('emailNotifications').toBoolean(),
    check('textNotifications').toBoolean(),
    check('twoFactorAuth').toBoolean(),
    check('signature').optional(),
], Auth, OrganisationController.updateProfile);

router.post('/upload-logo', Auth, upload.single('file'), uploadImage, OrganisationController.uploadLogo);
router.post('/upload-profile-image', Auth, upload.single('file'), uploadImage, OrganisationController.uploadProfileImage);

router.put(`/app-settings`, Auth, AppSettingsController.updateAppSettings);
router.get(`/app-settings`, Auth, AppSettingsController.getAppSettings);

router.get(`/notifications`, Auth, NotificationController.getNotifications);
router.put(`/notifications`, Auth, NotificationController.updateNotification);

router.get(`/client-hub`, Auth, ClientHubController.getClientHubSettings)
router.put(`/client-hub`, [
    check('data').isArray().withMessage('data is required'),
], Auth, ClientHubController.updateClientHubSettings);

router.post('/upload-doc', Auth, uploadDoc.single('file'), OrganisationController.uploadDoc);

module.exports =  router;