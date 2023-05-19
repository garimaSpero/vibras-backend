const express = require('express');
const UserController = require('../../controllers/Organisation/UserController');
const Auth = require('../../middlewares/Auth');

const upload = require('../../middlewares/upload');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();
const { check, query } = require('express-validator');

router.put('/', [
    check('firstName').not().isEmpty().withMessage('First name is required'),
    check('lastName').optional(),
    check('source').optional(),
    check('role').optional(),
    check('addresses').optional(),
    check('phone').not().isEmpty().withMessage('Phone number is required'),
    check('defaultCalender').optional(),
    check('emailNotifications').toBoolean(),
    check('textNotifications').toBoolean(),
    check('twoFactorAuth').toBoolean(),
   
], Auth, UserController.updateUser);

router.post('/', [
    check('firstName').not().isEmpty().withMessage('First name is required'),
    check('lastName').optional(),
    check('source').optional(),
    check('role').optional(),
    check('addresses').optional(),
    check('phone').not().isEmpty().withMessage('Phone number is required'),
    check('defaultCalender').optional(),
    check('emailNotifications').toBoolean(),
    check('textNotifications').toBoolean(),
    check('twoFactorAuth').toBoolean(),

], Auth, UserController.createUser);

router.get('/', Auth, UserController.getUser);
router.get('/all', Auth, UserController.getUsers);

router.get('/notes', Auth, UserController.getUserNotes);
router.post('/note', [
    check('note').not().isEmpty().withMessage('Note is required'),
], Auth, UserController.createNote);

router.delete('/note', [
    query('noteId')
        .exists()
        .withMessage('Attachment id is required'),
], Auth, UserController.deleteUserNote);

router.get('/attachments', Auth, UserController.getUserAttachments);
router.post('/attachment', [Auth, upload.single('file')], UserController.saveAttachments);
router.delete('/attachment', [
    query('attachmentId')
        .exists()
        .withMessage('Attachment id is required'),
], Auth, UserController.deleteAttachment);

router.delete('/', [
    query('id')
        .exists()
        .withMessage('User id is required'),
], Auth, UserController.deleteUser);
module.exports =  router;