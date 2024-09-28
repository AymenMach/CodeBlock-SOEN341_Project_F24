const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema ({
  name: { type: String, require: true },
  students: [{ type: mongoose.Schema.Types.ObjectID, ref: 'user' }]
}];

module.exports = mongoose.model('group', groupSchema);
