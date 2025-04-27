const express = require('express');
const router = express.Router();
const { 
  getAllGoals, 
  getGoalById, 
  createGoal, 
  updateGoal, 
  deleteGoal, 
  completeGoal, 
  generatePlan 
} = require('../controllers/goalController');
const { 
  getTasksByGoal, 
  createTask, 
  generateTasks 
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Goal routes
router.route('/')
  .get(getAllGoals)
  .post(createGoal);

router.route('/:goalId')
  .get(getGoalById)
  .put(updateGoal)
  .delete(deleteGoal);

router.patch('/:goalId/complete', completeGoal);
router.post('/generate-plan', generatePlan);

// Task routes related to goals
router.route('/:goalId/tasks')
  .get(getTasksByGoal)
  .post(createTask);

router.post('/:goalId/generate-tasks', generateTasks);

module.exports = router;