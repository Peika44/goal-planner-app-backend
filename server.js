const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");
const authRoutes = require("./routes/auth");
const goalRoutes = require("./routes/goals");
const taskRoutes = require("./routes/tasks");
const authenticateToken = require("./middleware/auth");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/goals", authenticateToken, goalRoutes);
app.use("/api/tasks", authenticateToken, taskRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



