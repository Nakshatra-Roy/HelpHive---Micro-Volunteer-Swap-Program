const express = require('express');
<<<<<<< HEAD
const { createTask, deleteTask, getTasks, updateTask, acceptTask, swapReq, acceptSwap } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
=======
const { createTask, deleteTask, getTasks, updateTask, acceptTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
>>>>>>> 935e2cfcca5252d038027786282023fe808d601c


const router = express.Router();

router.get('/', getTasks);
<<<<<<< HEAD
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask); 
router.put('/:id/accept', authMiddleware, acceptTask);
router.put('/:tId1/:tId2/swap', authMiddleware, swapReq);
router.put('/:tId1/:tId2/acceptSwap', authMiddleware, acceptSwap);
=======
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask); 
router.put('/:id/accept', protect, acceptTask); 
>>>>>>> 935e2cfcca5252d038027786282023fe808d601c

module.exports = router;
