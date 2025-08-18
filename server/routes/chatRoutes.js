import express from 'express';
const router = express.Router();
import { initializeChat, getChatHistory } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/init', protect, initializeChat);
router.get('/history/:taskId', protect, getChatHistory);

export default router;