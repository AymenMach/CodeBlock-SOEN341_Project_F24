const mongoose = require('mongoose');

// Define a schema for each individual rating
const ratingSchema = new mongoose.Schema({
    memberId: { type: String, required: true },
    cooperation: { type: Number, required: true },  // 1-5 scale for cooperation
    conceptual: { type: String, default: '' },      // Comments for conceptual contribution
    practical: { type: String, default: '' },       // Comments for practical contribution
    workEthic: { type: String, default: '' },       // Comments for work ethic
});

const assessmentSchema = new mongoose.Schema({
    groupId: { type: String, required: true },
    groupName: { type: String, required: true },  // Store the group name
    assessorId: { type: String, required: true },
    ratings: [ratingSchema],  // Array of ratings for the group members
    createdAt: { type: Date, default: Date.now },
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
