const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');

router.get('/', verifyTokenMiddleware, checkPermission('Tasks', 'View'), controller.getAllTasks);
router.get('/my-tasks', verifyTokenMiddleware, controller.getMyTasks);
router.post('/', verifyTokenMiddleware, checkPermission('Tasks', 'Create'), controller.createTask);
router.put('/:id', verifyTokenMiddleware, controller.updateTask);
router.delete('/:id', verifyTokenMiddleware, checkPermission('Tasks', 'Delete'), controller.deleteTask);

module.exports = router;
