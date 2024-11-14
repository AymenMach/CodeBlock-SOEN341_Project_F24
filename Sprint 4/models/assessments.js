const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    cooperation: { type: String, default: "" },
    conceptual: { type: String, default: "" },
    practical: { type: String, default: "" },
    workEthic: { type: String, default: "" },
});

const ratingSchema = new mongoose.Schema({
    memberId: { type: String, required: true },
    cooperation: { type: Number, required: true },
    conceptual: { type: Number, required: true },
    practical: { type: Number, required: true },
    workEthic: { type: Number, required: true },
    feedback: { type: feedbackSchema, required: true },
});

const assessmentSchema = new mongoose.Schema({
    groupId: { type: String, required: true },
    groupName: { type: String, required: true },
    assessorId: { type: String, required: true },
    ratings: [ratingSchema],
    createdAt: { type: Date, default: Date.now },
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
