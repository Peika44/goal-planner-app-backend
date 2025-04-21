const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description: String,
  timeframe: String,
  aiPlan: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("goals", goalSchema);
