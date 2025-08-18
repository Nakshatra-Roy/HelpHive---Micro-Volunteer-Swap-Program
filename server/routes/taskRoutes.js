import express from 'express';
import { createTask, deleteTask, getTasks, updateTask, acceptTask, swapReq, acceptSwap } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTasks);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask); 
router.put('/:id/accept', protect, acceptTask);
router.put('/:tId1/:tId2/swap', protect, swapReq);
router.put('/:tId1/:tId2/acceptSwap', protect, acceptSwap);

export default router;
