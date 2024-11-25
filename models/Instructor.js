const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    name: { type: String, required: true },
    role: { type: String, default: 'instructor', required: true } 
});

const Instructor = mongoose.models.Instructor || mongoose.model('Instructor', instructorSchema);

module.exports = Instructor;
