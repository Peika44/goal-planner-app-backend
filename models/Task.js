const mongoose = require('mongoose');
const Goal = require('./Goal');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide a due date']
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  goal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update goal progress when task is saved or deleted
TaskSchema.post('save', async function() {
  await updateGoalProgress(this.goal);
});

TaskSchema.post('remove', async function() {
  await updateGoalProgress(this.goal);
});

// Helper function to update goal progress
async function updateGoalProgress(goalId) {
  try {
    const goal = await Goal.findById(goalId);
    
    if (!goal) {
      return;
    }
    
    // Count total and completed tasks for this goal
    const totalTasks = await mongoose.model('Task').countDocuments({ goal: goalId });
    const completedTasks = await mongoose.model('Task').countDocuments({ 
      goal: goalId, 
      isCompleted: true 
    });
    
    // Calculate progress percentage
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    
    // Update goal progress
    goal.progress = progress;
    
    // If all tasks are completed, mark the goal as completed
    if (totalTasks > 0 && progress === 100) {
      goal.isCompleted = true;
    } else {
      goal.isCompleted = false;
    }
    
    await goal.save();
  } catch (error) {
    console.error('Error updating goal progress:', error);
  }
}

module.exports = mongoose.model('Task', TaskSchema);