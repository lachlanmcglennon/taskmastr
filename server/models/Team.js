const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamId: { type: String, required: true },
  name: { type: String, required: true },
  members: [String], // user IDS
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  encryptedKeys: { type: Map, of: String }, // uid -> encrypted key
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Team', teamSchema);
