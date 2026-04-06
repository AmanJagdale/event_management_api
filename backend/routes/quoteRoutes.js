const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', quoteController.getQuotes);

// Admin-only routes
router.post('/', verifyToken, isAdmin, quoteController.createQuote);
router.put('/:id', verifyToken, isAdmin, quoteController.updateQuote);
router.delete('/:id', verifyToken, isAdmin, quoteController.deleteQuote);

module.exports = router;
