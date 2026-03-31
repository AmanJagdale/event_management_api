const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

router.get('/', eventController.getEvents);
router.post('/', eventController.createEvent);
router.post('/register-event', auth, eventController.registerEvent);

module.exports = router;
