const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', auth, getProfile);
router.put('/', [auth, upload.single('profilePicture')], updateProfile);

module.exports = router;