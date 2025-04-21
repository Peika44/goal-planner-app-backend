const express = require("express");
const router = express.Router();
const { createGoal, getUserGoals } = require("../controllers/goalController");
// const path = require('path');
// const authenticateToken = require(path.resolve(__dirname, '../middleware/auth'));
const authenticateToken = require("../middleware/auth");

router.post("/", authenticateToken, createGoal);
router.get("/", authenticateToken, getUserGoals);

module.exports = router;
