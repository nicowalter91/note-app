// Task routes
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/tasks");
const authenticateUser = require("../middleware/authenticateUser");

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Task CRUD operations
router.post("/add-task", taskController.addTask);
router.put("/edit-task/:taskId", taskController.editTask);
router.get("/get-all-tasks", taskController.getTasks);
router.delete("/delete-task/:taskId", taskController.deleteTask);
router.put("/update-task-pinned/:taskId", taskController.isPinned);
router.put("/update-task-status/:taskId", taskController.updateStatus);
router.get("/search-tasks", taskController.searchTask);
router.get("/get-task-stats", taskController.getTaskStats);

module.exports = router;
