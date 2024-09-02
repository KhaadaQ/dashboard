const express = require("express");
const PORT = 3000;
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const app = express();
app.use(express.json());

const verifyToken = require("./Middlewares/auth");

// Serve static files from the "Frontend" directory
app.use(express.static(path.join(__dirname, "Frontend")));

// Serve the landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "landingPage.html"));
});

// Serve the registration page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "register.html"));
});

// Routes management
const userRouter = require("./Routers/userRouter");
const taskRouter = require("./Routers/taskRouter");

// MongoDB connection
const mongodb_url = process.env.MONGO_URL;

// Connect to MongoDB
mongoose.connect(mongodb_url);

const db = mongoose.connection;

db.on("error", (error) => {
  console.log("Error when connecting to MongoDB:", error);
});

db.on("connected", () => {
  console.log("Connected to MongoDB successfully");
});

db.on("disconnected", () => {
  console.log("MongoDB is disconnected");
});

app.use("/user", userRouter);
app.use("/tasks", verifyToken, taskRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
