
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  teamId: { type: String, required: true },
  name: { type: String, required: true },
  startDate: String,
  endDate: String,
  assignedTo: [String], // user emails
  description: String
});

module.exports = mongoose.model('Task', taskSchema);
