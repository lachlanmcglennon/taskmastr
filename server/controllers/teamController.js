
const storage = require('../utils/storageWrapper');

exports.getTasks = async (req, res) => {
  try {
    const teamId = req.params.id;
    const tasks = await storage.getTasks(teamId);
    res.json(tasks);
  } catch {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const teamId = req.params.id;
    const taskData = { ...req.body, teamId };
    const newTask = await storage.saveTask(taskData);
    res.status(201).json(newTask);
  } catch {
    res.status(500).json({ error: 'Failed to create task' });
  }
};
