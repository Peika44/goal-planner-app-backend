const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: "Goal" },
  title: String,
  description: String,
  durationMinutes: Number,
  hardness: String,
  completed: { type: Boolean, default: false },
  dueDate: Date,
});

module.exports = mongoose.model("tasks", taskSchema);
