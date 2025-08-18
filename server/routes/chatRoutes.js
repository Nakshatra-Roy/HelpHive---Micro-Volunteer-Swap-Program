const express = require('express');
const router = express.Router();
const { initializeChat, getChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/init', protect, initializeChat);
router.get('/history/:taskId', protect, getChatHistory);

module.exports = router;