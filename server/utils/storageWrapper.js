
const Task = require('../models/Task');

exports.getTasks = async (teamId) => {
  return await Task.find({ teamId });
};

exports.saveTask = async (taskData) => {
  const task = new Task(taskData);
  return await task.save();
};
