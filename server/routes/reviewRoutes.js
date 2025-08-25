// server/routes/reviewRoutes.js
import express from 'express';
import { createReview, getSpecificReview, getAllMyReviewsForTask} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

// A user must be logged in to leave a review
router.post('/', protect, createReview);
router.get('/task/:taskId/for/:revieweeId', protect, getSpecificReview);
router.get('/task/:taskId/byMe', protect, getAllMyReviewsForTask);

export default router;