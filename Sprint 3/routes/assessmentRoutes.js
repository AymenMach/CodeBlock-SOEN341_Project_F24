const express = require('express');
const router = express.Router();
const Assessment = require('../models/assessments');  // Import Assessment model
const Group = require('../models/group');  // Import Group model

// Route for submitting assessments
router.post('/', async (req, res) => {
    const { groupId, assessorId, ratings } = req.body;

    console.log('Received request body:', req.body);  // Log incoming data

    try {
        // Check if all required fields are present
        if (!groupId || !assessorId || !ratings || ratings.length === 0) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Fetch the group name based on the groupId
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const groupName = group.name; 

        // Log the group name to verify that it's being fetched correctly
        console.log('Fetched group name:', groupName);

        // Ensure the ratings match the new schema format
        const formattedRatings = ratings.map(rating => {
            // Destructure and validate the rating for each member
            const { memberId, cooperation, conceptual, practical, workEthic } = rating;

            if (typeof cooperation !== 'number' || isNaN(cooperation) || cooperation < 1 || cooperation > 5) {
                throw new Error('Invalid cooperation rating. It should be a number between 1 and 5.');
            }

            return {
                memberId,
                cooperation,          // Numeric cooperation rating (1-5)
                conceptual: conceptual || '',  // Text comment for conceptual contribution
                practical: practical || '',    // Text comment for practical contribution
                workEthic: workEthic || ''     // Text comment for work ethic
            };
        });

        // Create the new assessment document with the formatted ratings
        const newAssessment = new Assessment({
            groupId,
            groupName,  // Store group name
            assessorId,
            ratings: formattedRatings,  
            createdAt: new Date(),  
        });

        // Save the new assessment to the database
        await newAssessment.save();

        // Return the saved assessment as the response
        return res.status(201).json(newAssessment);  
    } catch (error) {
        console.error('Error saving assessment:', error);
        return res.status(500).json({ message: 'Failed to save assessment', error: error.message });
    }
});

module.exports = router;
