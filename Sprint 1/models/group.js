const mongoose = require('mongoose');

// Creates group collection in MongoDB
const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  participants: [{ type: String }], // Added participants as an array of strings
});

module.exports = mongoose.model('groups', groupSchema);
