const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Member-only
router.get('/profile', verifyToken, userController.getProfile);

// Admin-only routes
router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.post('/admin/upload-members', verifyToken, isAdmin, upload.single('file'), userController.bulkUploadMembers);
router.post('/admin/delete-multiple', verifyToken, isAdmin, userController.deleteSelectedMembers);
router.delete('/:id', verifyToken, isAdmin, userController.adminDeleteUser);

module.exports = router;
