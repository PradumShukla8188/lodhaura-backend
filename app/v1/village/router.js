const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { isAdmin } = require('../../../middleware/isAdmin');

router.get('/info', controller.getVillageInfo);
router.patch('/info', verifyTokenMiddleware, isAdmin, controller.updateVillageInfo);
router.get('/temples', controller.getTemples);
router.post('/temples', verifyTokenMiddleware, isAdmin, controller.createTemple);
router.get('/schools', controller.getSchools);
router.post('/schools', verifyTokenMiddleware, isAdmin, controller.createSchool);
router.get('/services', controller.getServices);
router.post('/services', verifyTokenMiddleware, isAdmin, controller.createService);

module.exports = router;
