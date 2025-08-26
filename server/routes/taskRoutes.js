import express from 'express';
import { createTask, deleteTask, getTasks, updateTask, acceptTask, completeTask, swapReq, acceptSwap, createSwapRequest, 
  getSwapRequests, getCompletedTasks, 
  respondToSwapRequest, helperSwap  } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTasks);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask); 
router.put('/:id/accept', protect, acceptTask);
router.put('/:tId1/:tId2/swap', protect, swapReq);
router.put('/:tId1/:tId2/acceptSwap', protect, acceptSwap);
router.patch('/:id/complete', protect, completeTask);
router.route('/swaps')
  .get(protect, getSwapRequests)
  .post(protect, createSwapRequest);
router.get('/completed', protect, getCompletedTasks);
router.put('/swaps/:swapRequestId/respond', protect, respondToSwapRequest);
router.put('/:myCommittedTaskId/:theirOpenTaskId/helper-swap', protect, helperSwap);

export default router;