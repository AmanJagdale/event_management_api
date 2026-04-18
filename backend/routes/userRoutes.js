const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// 1. Get Profile (Private)
router.get('/profile', verifyToken, userController.getProfile);

// 2. Show All Members (Admin)
// Frontend calls: /api/users
router.get('/', verifyToken, isAdmin, userController.getAllUsers);

// 3. Bulk Upload (Admin) 
// CHANGED to match your frontend call: /api/users/bulk-upload
router.post('/bulk-upload', verifyToken, isAdmin, upload.single('file'), userController.bulkUploadMembers);

// 4. Delete Single Member (Admin)
// Frontend calls: /api/users/:id
router.delete('/:id', verifyToken, isAdmin, userController.adminDeleteUser);

// 5. Bulk Delete (Admin)
router.post('/delete-multiple', verifyToken, isAdmin, userController.deleteSelectedMembers);

module.exports = router;
