const express = require('express');
const router = express.Router();
const controller = require('./controller');
const {
    createUserValidator,
    updateUserValidator,
    getUserByIdValidator,
    deleteUserValidator
} = require('./validator');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');

router.use(verifyTokenMiddleware);

router.get('/', checkPermission('users', 'view'), controller.getAllUsers);
router.get('/:id', checkPermission('users', 'view'), getUserByIdValidator, controller.getUserById);
router.post('/', checkPermission('users', 'create'), createUserValidator, controller.createUser);
router.patch('/:id', checkPermission('users', 'edit'), updateUserValidator, controller.updateUser);
router.delete('/:id', checkPermission('users', 'delete'), deleteUserValidator, controller.deleteUser);

module.exports = router;
