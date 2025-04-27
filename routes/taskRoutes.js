const express = require('express');
const router = express.Router();
const { 
  updateTask, 
  deleteTask, 
  completeTask, 
  getTodayTasks 
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Task routes
router.get('/today', getTodayTasks);

router.route('/:taskId')
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:taskId', completeTask);

module.exports = router;