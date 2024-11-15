const Task = require('../models/Task');

// Create a new task
const createTask = async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
    }
    try {
        const task = new Task({ userId: req.user.userId, name, description });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
};

// Get all tasks for the authenticated user, with optional filters and search
const getTasks = async (req, res) => {
    const { status, search } = req.query;  // Get filter and search criteria from query parameters

    try {
        // Build the query object dynamically based on the provided filters
        const query = { userId: req.user.userId };  // Ensure the query filters by the user

        // Add status filter if provided
        if (status) {
            query.status = status;
        }

        // Add search filter if provided (search by task name)
        if (search) {
            query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
        }

        // Execute the query
        const tasks = await Task.find(query);

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
};

// Update a specific task
const updateTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findOneAndUpdate(
            { _id: id, userId: req.user.userId }, // Ensure the task belongs to the user
            req.body,
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ error: 'Task not found or not authorized' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
};

// Delete a specific task
const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findOneAndDelete({ _id: id, userId: req.user.userId });
        if (!task) {
            return res.status(404).json({ error: 'Task not found or not authorized' });
        }
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
