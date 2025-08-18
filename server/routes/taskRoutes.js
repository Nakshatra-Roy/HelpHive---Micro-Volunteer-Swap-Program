const express = require('express');
const { createTask, deleteTask, getTasks, updateTask, acceptTask, swapReq, acceptSwap } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

router.get('/', getTasks);
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask); 
router.put('/:id/accept', authMiddleware, acceptTask);
router.put('/:tId1/:tId2/swap', authMiddleware, swapReq);
router.put('/:tId1/:tId2/acceptSwap', authMiddleware, acceptSwap);

module.exports = router;
