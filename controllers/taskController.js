const Task = require('../models/Task');
const Goal = require('../models/Goal');

/**
 * @desc    Get all tasks for a specific goal
 * @route   GET /api/goals/:goalId/tasks
 * @access  Private
 */
const getTasksByGoal = async (req, res) => {
  try {
    // Check if goal exists and belongs to user
    const goal = await Goal.findById(req.params.goalId);
    
    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }
    
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this goal'
      });
    }
    
    const tasks = await Task.find({ goal: req.params.goalId }).sort({ dueDate: 1 });
    
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Get tasks scheduled for today
 * @route   GET /api/tasks/today
 * @access  Private
 */
const getTodayTasks = async (req, res) => {
  try {
    // Get today's date range (start of day to end of day)
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    // Find tasks due today
    const tasks = await Task.find({
      user: req.user._id,
      dueDate: { $gte: startOfDay, $lte: endOfDay }
    }).populate('goal', 'title').sort({ priority: -1 });
    
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Create new task for a goal
 * @route   POST /api/goals/:goalId/tasks
 * @access  Private
 */
const createTask = async (req, res) => {
  try {
    // Check if goal exists and belongs to user
    const goal = await Goal.findById(req.params.goalId);
    
    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }
    
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to add tasks to this goal'
      });
    }
    
    // Add goal and user to request body
    req.body.goal = req.params.goalId;
    req.body.user = req.user._id;
    
    const task = await Task.create(req.body);
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:taskId
 * @access  Private
 */
const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    // Check if task belongs to user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this task'
      });
    }
    
    task = await Task.findByIdAndUpdate(req.params.taskId, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:taskId
 * @access  Private
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    // Check if task belongs to user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this task'
      });
    }
    
    await task.remove();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Toggle task completion status
 * @route   PATCH /api/tasks/:taskId
 * @access  Private
 */
const completeTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    // Check if task belongs to user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this task'
      });
    }
    
    // Toggle completion status
    task.isCompleted = !task.isCompleted;
    await task.save();
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Generate tasks for a goal (AI-assisted)
 * @route   POST /api/goals/:goalId/generate-tasks
 * @access  Private
 */
const generateTasks = async (req, res) => {
  try {
    // Check if goal exists and belongs to user
    const goal = await Goal.findById(req.params.goalId);
    
    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }
    
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to generate tasks for this goal'
      });
    }
    
    // In a real application, this would call an AI service
    // For now, generate some sample tasks based on the goal's category
    let suggestedTasks = [];
    
    // Calculate dates based on goal target date
    const targetDate = new Date(goal.targetDate);
    const currentDate = new Date();
    const daysDifference = Math.ceil((targetDate - currentDate) / (1000 * 60 * 60 * 24));
    const interval = Math.max(Math.floor(daysDifference / 4), 1); // Split into 4 phases
    
    // Generate tasks based on goal category
    switch (goal.category) {
      case 'Personal':
        suggestedTasks = [
          {
            title: 'Define personal growth objectives',
            description: 'Clarify what success looks like for this personal goal',
            dueDate: new Date(currentDate.getTime() + interval * 1 * 24 * 60 * 60 * 1000),
            priority: 'High'
          },
          {
            title: 'Research resources and methods',
            description: 'Find books, courses, or mentors that can help',
            dueDate: new Date(currentDate.getTime() + interval * 2 * 24 * 60 * 60 * 1000),
            priority: 'Medium'
          },
          {
            title: 'Create detailed action plan',
            description: 'Break down the goal into smaller actionable steps',
            dueDate: new Date(currentDate.getTime() + interval * 3 * 24 * 60 * 60 * 1000),
            priority: 'Medium'
          }
        ];
        break;
      case 'Professional':
        suggestedTasks = [
          {
            title: 'Define career milestones',
            description: 'Set specific, measurable targets for professional growth',
            dueDate: new Date(currentDate.getTime() + interval * 1 * 24 * 60 * 60 * 1000),
            priority: 'High'
          },
          {
            title: 'Skill assessment and gap analysis',
            description: 'Identify skills needed and current proficiency levels',
            dueDate: new Date(currentDate.getTime() + interval * 2 * 24 * 60 * 60 * 1000),
            priority: 'High'
          },
          {
            title: 'Networking and relationship building',
            description: 'Connect with professionals in your field',
            dueDate: new Date(currentDate.getTime() + interval * 3 * 24 * 60 * 60 * 1000),
            priority: 'Medium'
          }
        ];
        break;
      // Add more categories as needed
      default:
        suggestedTasks = [
          {
            title: 'Initial planning phase',
            description: 'Define scope and requirements',
            dueDate: new Date(currentDate.getTime() + interval * 1 * 24 * 60 * 60 * 1000),
            priority: 'High'
          },
          {
            title: 'Progress review',
            description: 'Assess progress and adjust plan as needed',
            dueDate: new Date(currentDate.getTime() + interval * 2 * 24 * 60 * 60 * 1000),
            priority: 'Medium'
          },
          {
            title: 'Final implementation',
            description: 'Complete remaining tasks and prepare for goal completion',
            dueDate: new Date(currentDate.getTime() + interval * 3 * 24 * 60 * 60 * 1000),
            priority: 'High'
          }
        ];
    }
    
    res.json({
      success: true,
      data: suggestedTasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getTasksByGoal,
  getTodayTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  generateTasks
};