const express = require('express');
const { createTask, deleteTask, getTasks, updateTask, acceptTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');


const router = express.Router();

router.get('/', getTasks);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask); 
router.put('/:id/accept', protect, acceptTask); 

module.exports = router;
