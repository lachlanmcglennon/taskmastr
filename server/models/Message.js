const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  teamId: { type: String, required: true },
  senderId: { type: String, required: true },
  encryptedContent: {
    type: Map,
    of: String, // Each value is an encrypted base64 string
    required: true
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);