import express from 'express';
const router = express.Router();
import {
    getStats,
    getMyActivity,
    getAllAdmins,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.get('/stats', protect, admin, getStats);
router.get('/my-activity', protect, admin, getMyActivity);
router.get('/all-admins', protect, admin, getAllAdmins);

export default router;