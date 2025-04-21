const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  const { goalId, title, description, durationMinutes, hardness, dueDate } = req.body;
  try {
    const newTask = await Task.create({
      goalId,
      title,
      description,
      durationMinutes,
      hardness,
      dueDate,
    });
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create task" });
  }
};

exports.getTasksByGoal = async (req, res) => {
  try {
    const tasks = await Task.find({ goalId: req.params.goalId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch tasks" });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, { completed: true }, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update task" });
  }
};
