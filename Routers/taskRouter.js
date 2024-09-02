const express = require("express");
const {
  getMyTasks,
  addTask,
  editTask,
  removeTask,
} = require("../Controllers/taskController");
const router = express.Router();

router.get("/", getMyTasks);
router.post("/", addTask);
router.put("/:id", editTask);
router.delete("/:id", removeTask);

module.exports = router;
