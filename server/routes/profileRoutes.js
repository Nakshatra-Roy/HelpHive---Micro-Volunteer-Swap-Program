import express from 'express';
const router = express.Router();
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { getProfile, updateProfile } from '../controllers/profileController.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', protect, getProfile);
router.put('/', [protect, upload.single('profilePicture')], updateProfile);

export default router;