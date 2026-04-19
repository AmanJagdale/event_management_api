const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Admin-only event creation
router.post('/', verifyToken, isAdmin, eventController.createEvent);

// Member Registration Status
router.get('/:id/check-registration', verifyToken, eventController.checkRegistrationState);
router.post('/:id/register', verifyToken, eventController.registerEvent);

// Admin-only participants view
router.get('/:id/registrations', verifyToken, isAdmin, eventController.getEventRegistrations);

module.exports = router;
