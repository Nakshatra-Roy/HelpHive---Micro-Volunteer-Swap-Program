import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { getUserTasks} from '../controllers/userController.js';

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/:userId/tasks', protect, getUserTasks);
router.post('/', userController.createUser);
router.post('/login', userController.loginUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
export default router;