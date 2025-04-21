const express = require("express");
const router = express.Router();
const { createTask, getTasksByGoal, completeTask } = require("../controllers/taskController");

router.post("/", createTask);
router.get("/:goalId", getTasksByGoal);
router.patch("/:taskId/complete", completeTask);

module.exports = router;
