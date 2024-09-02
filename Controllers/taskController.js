const taskModel = require("../Models/taskModel");

const getMyTasks = async (req, res) => {
  try {
    if (!req.payload || !req.payload.userId) {
      return res.status(400).json({ status: "failed", message: "User ID missing" });
    }
    const userId = req.payload.userId;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [tasks, taskCount] = await Promise.all([
      taskModel.find({ userId }).skip(skip).limit(limit),
      taskModel.countDocuments({ userId }),
    ]);

    if (tasks.length === 0) {
      return res.status(404).json({ status: "failed", message: "No tasks found" });
    }
    const totalPages = Math.ceil(taskCount / limit);
    res.status(200).json({
      status: "succeeded",
      tasks,
      currentPage: parseInt(page),
      totalPages,
    });
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({ status: "failed", error: error.message });
  }
};

const addTask = async (req, res) => {
  try {
    if (!req.payload || !req.payload.userId) {
      return res.status(400).json({ status: "failed", message: "User ID missing" });
    }
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ status: "failed", message: "Title is required" });
    }
    const newTask = {
      title,
      description: description || "",
      completed: false,
      userId: req.payload.userId,
    };
    const task = await taskModel.create(newTask);
    res.status(201).json({ status: "succeeded", task });
  } catch (error) {
    res.status(500).json({ status: "failed", error: error.message });
  }
};

const editTask = async (req, res) => {
  try {
    if (!req.payload || !req.payload.userId) {
      return res.status(400).json({ status: "failed", message: "User ID missing" });
    }
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const updatedTask = await taskModel.findByIdAndUpdate(
      id,
      { title, description, completed },
      { new: true, runValidators: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ status: "failed", message: "Task not found" });
    }
    res.status(200).json({ status: "succeeded", task: updatedTask });
  } catch (error) {
    res.status(500).json({ status: "failed", error: error.message });
  }
};

const removeTask = async (req, res) => {
  try {
    if (!req.payload || !req.payload.userId) {
      return res.status(400).json({ status: "failed", message: "User ID missing" });
    }
    const { id } = req.params;

    const deletedTask = await taskModel.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ status: "failed", message: "Task not found" });
    }

    res.status(200).json({ status: "succeeded", message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "failed", error: error.message });
  }
};

module.exports = { getMyTasks, addTask, editTask, removeTask };
