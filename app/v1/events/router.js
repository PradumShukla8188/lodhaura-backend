const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyTokenMiddleware } = require('../../../middleware/verifyJwt');
const { checkPermission } = require('../../../middleware/checkPermission');

// Public Event Routes
router.get('/', controller.getAllEvents);
router.get('/:id', controller.getEventById);

// Public Participation/Donation Routes (Requires Login)
router.post('/:id/register', verifyTokenMiddleware, controller.registerForEvent);
router.post('/:id/donate', verifyTokenMiddleware, controller.donateToEvent);

// Admin Event Routes
router.post('/', verifyTokenMiddleware, checkPermission('Events', 'Create'), controller.createEvent);
router.put('/:id', verifyTokenMiddleware, checkPermission('Events', 'Edit'), controller.updateEvent);
router.delete('/:id', verifyTokenMiddleware, checkPermission('Events', 'Delete'), controller.deleteEvent);

// Admin Participants & Donations Routes
router.get('/:id/participants', verifyTokenMiddleware, checkPermission('Events', 'Manage Participants'), controller.getEventRegistrations);
router.put('/:id/participants/:registrationId', verifyTokenMiddleware, checkPermission('Events', 'Manage Participants'), controller.updateRegistrationStatus);
router.get('/:id/donations', verifyTokenMiddleware, checkPermission('Events', 'Manage Donations'), controller.getEventDonations);

module.exports = router;
