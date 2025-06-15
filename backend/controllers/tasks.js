// Controller for Trainer Tasks
const Task = require("../models/task.model");

// Create a new task
const addTask = async (req, res) => {
    const { 
        title, 
        description, 
        dueDate, 
        tags, 
        priority, 
        status, 
        assignedTo,
        category
    } = req.body;
    
    const { user } = req.user;
  
    if (!title)
        return res.status(400).json({ error: true, message: "Title is required" });
    if (!description)
        return res.status(400).json({ error: true, message: "Description is required" });
  
    try {
        const task = new Task({
            title,
            description,
            dueDate: dueDate || null,
            tags: tags || [],
            priority: priority || 'medium',
            status: status || 'pending',
            assignedTo: assignedTo || [],
            category: category || 'training',
            userId: user._id,
        });
  
        await task.save();
        return res.json({ error: false, task, message: "Task added successfully" });
    } catch (error) {
        console.error("Error adding task:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Edit an existing task
const editTask = async (req, res) => {
    const { taskId } = req.params;
    const { 
        title, 
        description, 
        dueDate, 
        tags, 
        priority, 
        status, 
        assignedTo,
        category,
        isPinned,
        completedOn
    } = req.body;
    
    const { user } = req.user;
  
    try {
        const task = await Task.findOne({ _id: taskId, userId: user._id });
        if (!task)
            return res.status(404).json({ error: true, message: "Task not found" });
  
        // Update fields if provided
        if (title) task.title = title;
        if (description) task.description = description;
        if (dueDate !== undefined) task.dueDate = dueDate;
        if (tags) task.tags = tags;
        if (priority) task.priority = priority;
        if (status) {
            task.status = status;
            // If status is completed and completedOn is not set, set it to now
            if (status === 'completed' && !task.completedOn) {
                task.completedOn = new Date();
            } else if (status !== 'completed') {
                task.completedOn = null;
            }
        }
        if (assignedTo) task.assignedTo = assignedTo;
        if (category) task.category = category;
        if (isPinned !== undefined) task.isPinned = isPinned;
        if (completedOn !== undefined) task.completedOn = completedOn;
  
        await task.save();
        return res.json({
            error: false,
            task,
            message: "Task updated successfully",
        });
    } catch (error) {
        console.error("Error editing task:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Get all tasks for a user
const getTasks = async (req, res) => {
    const { user } = req.user;
    const { status, category, priority, sortBy, sortOrder } = req.query;

    try {
        // Build query conditions
        const query = { userId: user._id };
        
        // Add filters if provided
        if (status) query.status = status;
        if (category) query.category = category;
        if (priority) query.priority = priority;
        
        // Build sort options
        const sort = {};
        if (sortBy) {
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        } else {
            // Default sort: isPinned first, then by dueDate (soonest first), then by priority
            sort.isPinned = -1;
            sort.dueDate = 1;
            sort.priority = -1;
        }

        const tasks = await Task.find(query).sort(sort);
        
        return res.json({
            error: false,
            tasks,
            message: "Tasks retrieved successfully",
        });
    } catch (error) {
        console.error("Error getting tasks:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    const { taskId } = req.params;
    const { user } = req.user;

    try {
        const task = await Task.findOne({ _id: taskId, userId: user._id });
        if (!task)
            return res.status(404).json({ error: true, message: "Task not found" });

        await Task.deleteOne({ _id: taskId, userId: user._id });
        return res.json({ error: false, message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Update the pinned status of a task
const isPinned = async (req, res) => {
    const { taskId } = req.params;
    const { isPinned } = req.body;
    const { user } = req.user;

    try {
        const task = await Task.findOne({ _id: taskId, userId: user._id });
        if (!task)
            return res.status(404).json({ error: true, message: "Task not found" });

        task.isPinned = isPinned;
        await task.save();
        return res.json({
            error: false,
            task,
            message: "Task updated successfully",
        });
    } catch (error) {
        console.error("Error updating pinned status:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Update the status of a task
const updateStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    const { user } = req.user;

    try {
        const task = await Task.findOne({ _id: taskId, userId: user._id });
        if (!task)
            return res.status(404).json({ error: true, message: "Task not found" });

        task.status = status;
        
        // If status is completed, set completedOn to now
        if (status === 'completed' && !task.completedOn) {
            task.completedOn = new Date();
        } else if (status !== 'completed') {
            task.completedOn = null;
        }
        
        await task.save();
        return res.json({
            error: false,
            task,
            message: "Task status updated successfully",
        });
    } catch (error) {
        console.error("Error updating task status:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Search tasks
const searchTask = async (req, res) => {
    const { user } = req.user;
    const { query, status, category, priority } = req.query;

    try {
        // Build search query
        const searchQuery = { userId: user._id };
        
        // Text search if query provided
        if (query) {
            searchQuery.$or = [
                { title: { $regex: new RegExp(query, "i") } },
                { description: { $regex: new RegExp(query, "i") } },
                { tags: { $regex: new RegExp(query, "i") } }
            ];
        }
        
        // Add filters if provided
        if (status) searchQuery.status = status;
        if (category) searchQuery.category = category;
        if (priority) searchQuery.priority = priority;
        
        const tasks = await Task.find(searchQuery)
            .sort({ isPinned: -1, dueDate: 1, priority: -1 });
            
        return res.json({
            error: false,
            tasks,
            message: "Tasks matching query retrieved",
        });
    } catch (error) {
        console.error("Error searching tasks:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

// Get task statistics
const getTaskStats = async (req, res) => {
    const { user } = req.user;

    try {
        // Get counts by status
        const statusCounts = await Task.aggregate([
            { $match: { userId: user._id } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        
        // Get counts by category
        const categoryCounts = await Task.aggregate([
            { $match: { userId: user._id } },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);
        
        // Get counts by priority
        const priorityCounts = await Task.aggregate([
            { $match: { userId: user._id } },
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);
        
        // Get overdue tasks count
        const overdueTasks = await Task.countDocuments({
            userId: user._id,
            dueDate: { $lt: new Date() },
            status: { $ne: 'completed' }
        });
        
        // Get tasks due today
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const dueTodayTasks = await Task.countDocuments({
            userId: user._id,
            dueDate: { 
                $gte: new Date(today.setHours(0, 0, 0, 0)), 
                $lt: new Date(tomorrow.setHours(0, 0, 0, 0)) 
            },
            status: { $ne: 'completed' }
        });
        
        return res.json({
            error: false,
            stats: {
                byStatus: statusCounts,
                byCategory: categoryCounts,
                byPriority: priorityCounts,
                overdue: overdueTasks,
                dueToday: dueTodayTasks
            },
            message: "Task statistics retrieved successfully",
        });
    } catch (error) {
        console.error("Error getting task stats:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

module.exports = { 
    addTask, 
    editTask, 
    getTasks, 
    deleteTask, 
    isPinned, 
    updateStatus,
    searchTask,
    getTaskStats
};
