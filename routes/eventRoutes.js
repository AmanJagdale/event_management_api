const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', eventController.getEvents);
// Admin-only event creation
router.post('/', verifyToken, isAdmin, eventController.createEvent);
router.post('/register-event', verifyToken, eventController.registerEvent);

module.exports = router;
