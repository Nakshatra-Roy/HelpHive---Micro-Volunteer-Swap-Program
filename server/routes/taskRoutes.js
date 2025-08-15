const express = require('express');
const { createTask, deleteTask, getTasks, updateTask, acceptTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

router.get('/', getTasks);
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask); 
router.put('/:id/accept', authMiddleware, acceptTask); 

module.exports = router;
