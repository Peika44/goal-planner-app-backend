const Goal = require('../models/Goal');
const Task = require('../models/Task');

/**
 * @desc    Get all goals for a user
 * @route   GET /api/goals
 * @access  Private
 */
const getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Get single goal by ID
 * @route   GET /api/goals/:goalId
 * @access  Private
 */
const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.goalId);

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    // Check if goal belongs to user
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this goal'
      });
    }

    res.json({
      success: true,
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Create new goal
 * @route   POST /api/goals
 * @access  Private
 */
const createGoal = async (req, res) => {
  try {
    // Add user to request body
    req.body.user = req.user._id;

    const goal = await Goal.create(req.body);

    res.status(201).json({
      success: true,
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Update goal
 * @route   PUT /api/goals/:goalId
 * @access  Private
 */
const updateGoal = async (req, res) => {
  try {
    let goal = await Goal.findById(req.params.goalId);

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    // Check if goal belongs to user
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this goal'
      });
    }

    goal = await Goal.findByIdAndUpdate(req.params.goalId, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Delete goal
 * @route   DELETE /api/goals/:goalId
 * @access  Private
 */
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.goalId);

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    // Check if goal belongs to user
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this goal'
      });
    }

    // Delete all related tasks
    await Task.deleteMany({ goal: req.params.goalId });

    // Delete the goal
    await goal.remove();

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
 * @desc    Mark goal as complete
 * @route   PATCH /api/goals/:goalId/complete
 * @access  Private
 */
const completeGoal = async (req, res) => {
  try {
    let goal = await Goal.findById(req.params.goalId);

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    // Check if goal belongs to user
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this goal'
      });
    }

    // Mark as complete and set progress to 100%
    goal.isCompleted = true;
    goal.progress = 100;
    await goal.save();

    // Mark all related tasks as complete
    await Task.updateMany(
      { goal: req.params.goalId },
      { isCompleted: true }
    );

    res.json({
      success: true,
      data: goal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Generate AI plan for goal
 * @route   POST /api/goals/generate-plan
 * @access  Private
 */
const generatePlan = async (req, res) => {
  try {
    const { title, description, targetDate, category } = req.body;

    // In a real application, this would call an AI service to generate tasks
    // For now, we'll return a set of generic tasks
    const plan = {
      title,
      description,
      targetDate,
      category,
      tasks: [
        {
          title: 'Research and Planning',
          description: 'Initial research and planning phase',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          priority: 'High'
        },
        {
          title: 'Implementation Phase 1',
          description: 'Begin implementation of core elements',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
          priority: 'Medium'
        },
        {
          title: 'Review Progress',
          description: 'Review progress and adjust plan as needed',
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
          priority: 'Medium'
        },
        {
          title: 'Final Implementation',
          description: 'Complete all remaining tasks',
          dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 4 weeks from now
          priority: 'High'
        }
      ]
    };

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  completeGoal,
  generatePlan
};