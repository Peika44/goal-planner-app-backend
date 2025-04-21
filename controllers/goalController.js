const Goal = require("../models/Goal");

exports.createGoal = async (req, res) => {
  const { description, timeframe, aiPlan } = req.body;
  try {
    const newGoal = await Goal.create({
      userId: req.user.id,
      description,
      timeframe,
      aiPlan,
    });
    res.json(newGoal);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create goal" });
  }
};

exports.getUserGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch goals" });
  }
};
