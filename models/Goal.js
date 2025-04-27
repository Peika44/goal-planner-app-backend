const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a goal title'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Please provide a goal description'],
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    enum: ['Personal', 'Professional', 'Health', 'Financial', 'Educational', 'Other'],
    default: 'Personal'
  },
  targetDate: {
    type: Date,
    required: [true, 'Please provide a target date']
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
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

// Pre-save middleware to calculate progress based on completed tasks
GoalSchema.pre('save', async function(next) {
  if (this.isNew) {
    this.progress = 0;
    return next();
  }
  
  // Only attempt to calculate progress if the document was directly modified
  if (!this.isModified()) {
    return next();
  }
  
  next();
});

module.exports = mongoose.model('Goal', GoalSchema);