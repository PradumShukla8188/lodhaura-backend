const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');
const { isAdmin } = require('../../../middleware/isAdmin');

router.get('/info', controller.getVillageInfo);
router.patch('/info', verifyTokenMiddleware, checkPermission('Village Information', 'edit'), controller.updateVillageInfo);
router.get('/temples', controller.getTemples);
router.post('/temples', verifyTokenMiddleware, isAdmin, controller.createTemple);
router.get('/schools', controller.getSchools);
router.post('/schools', verifyTokenMiddleware, isAdmin, controller.createSchool);
router.get('/services', controller.getServices);
router.post('/services', verifyTokenMiddleware, isAdmin, controller.createService);

module.exports = router;
