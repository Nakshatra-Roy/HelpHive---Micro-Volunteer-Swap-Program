const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', protect, getProfile);
router.put('/', [protect, upload.single('profilePicture')], updateProfile);

module.exports = router;