const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');

router.get('/', verifyTokenMiddleware, checkPermission('Village Projects', 'View'), controller.getProjects);
router.get('/:id', verifyTokenMiddleware, checkPermission('Village Projects', 'View'), controller.getProjectById);
router.post('/', verifyTokenMiddleware, checkPermission('Village Projects', 'Create'), controller.createProject);
router.put('/:id', verifyTokenMiddleware, checkPermission('Village Projects', 'Edit'), controller.updateProject);
router.delete('/:id', verifyTokenMiddleware, checkPermission('Village Projects', 'Delete'), controller.deleteProject);

// Progress endpoints
router.get('/:id/progress', verifyTokenMiddleware, checkPermission('Village Projects', 'View'), controller.getProjectProgress);
router.post('/:id/progress', verifyTokenMiddleware, checkPermission('Village Projects', 'Update Progress'), controller.addProjectProgress);

module.exports = router;
