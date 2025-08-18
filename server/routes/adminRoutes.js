const express = require('express');
const router = express.Router();
const {
    getStats,
    getMyActivity,
    getAllAdmins,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getStats);
router.get('/my-activity', protect, admin, getMyActivity);
router.get('/all-admins', protect, admin, getAllAdmins);

module.exports = router;