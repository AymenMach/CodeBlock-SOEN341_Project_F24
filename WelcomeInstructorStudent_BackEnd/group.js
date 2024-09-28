const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema ({
  name: {type: String, required: true },
  students: [{type: mongoose.Schema.Types.ObjectID, ref: 'User' }]
}];

module.exports = mongoose.model('Group', groupSchema);
