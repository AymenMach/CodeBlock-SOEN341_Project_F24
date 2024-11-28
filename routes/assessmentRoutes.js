const express = require('express');
const router = express.Router();
const Assessment = require('../models/assessments'); 
const Group = require('../models/group');  
const Summary = require('../models/Summary'); 

// Route for submitting assessments (POST)
router.post('/', async (req, res) => {
    const { groupId, assessorId, ratings } = req.body;

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

   
        const formattedRatings = ratings.map(rating => {
            const { memberId, cooperation, conceptual, practical, workEthic, feedback } = rating;

           
            if (
                typeof cooperation !== 'number' || isNaN(cooperation) || cooperation < 1 || cooperation > 5 ||
                (conceptual && typeof conceptual !== 'number') ||
                (practical && typeof practical !== 'number') ||
                (workEthic && typeof workEthic !== 'number')
            ) {
                throw new Error('Ratings should be valid numbers between 1 and 5.');
            }

            return {
                memberId,
                cooperation,
                conceptual,
                practical,
                workEthic,
                feedback: feedback || {}  
            };
        });

        // Save the assessment
        const newAssessment = new Assessment({
            groupId,
            groupName,
            assessorId,
            ratings: formattedRatings,
            createdAt: new Date(),
        });

        await newAssessment.save();

    
        await generateSummaryForGroup(groupId, groupName);

        return res.status(201).json(newAssessment);  
    } catch (error) {
        console.error('Error saving assessment:', error);
        return res.status(500).json({ message: 'Failed to save assessment', error: error.message });
    }
});


// Route for fetching assessments (GET)
router.get('/', async (req, res) => {
    try {
        const assessments = await Assessment.find();  
        res.status(200).json(assessments);  
    } catch (error) {
        console.error('Error fetching assessments:', error);
        res.status(500).json({ message: 'Failed to fetch assessments', error: error.message });
    }
});

// Get assessments by groupId
router.get('/:groupId', async (req, res) => {
    const { groupId } = req.params;

    try {
        // Find assessments by groupId
        const assessments = await Assessment.find({ groupId });

        if (!assessments || assessments.length === 0) {
            return res.status(404).json({ message: 'No assessments found for this group.' });
        }

        // Return the assessments
        return res.status(200).json(assessments);
    } catch (error) {
        console.error('Error fetching assessments:', error);
        return res.status(500).json({ message: 'Failed to fetch assessments.', error: error.message });
    }
});

// Route to fetch all assessment summary data
router.get('/summary', async (req, res) => {
    try {
        // Fetch all summaries from the database
        const summaries = await Summary.find();

        if (!summaries || summaries.length === 0) {
            return res.status(404).json({ message: 'No summary data available.' });
        }

        // Return the summaries as a response
        res.status(200).json(summaries);
    } catch (error) {
        console.error('Error fetching summary data:', error);
        res.status(500).json({ message: 'Failed to fetch summary data', error: error.message });
    }
});

// function to generate and store summary data for a group
const generateSummaryForGroup = async (groupId, groupName) => {
    try {
        const assessments = await Assessment.find({ groupId });

        let totalRating = 0;
        let participantCount = 0;
        let totalRatings = 0;

        assessments.forEach(assessment => {
            assessment.ratings.forEach(rating => {
                
                if (
                    typeof rating.cooperation === 'number' && rating.cooperation >= 1 && rating.cooperation <= 5 &&
                    typeof rating.conceptual === 'number' && rating.conceptual >= 1 && rating.conceptual <= 5 &&
                    typeof rating.practical === 'number' && rating.practical >= 1 && rating.practical <= 5 &&
                    typeof rating.workEthic === 'number' && rating.workEthic >= 1 && rating.workEthic <= 5
                ) {
                    totalRating += rating.cooperation + rating.conceptual + rating.practical + rating.workEthic;
                    totalRatings += 4; 
                    participantCount += 1;
                }
            });
        });

       
        const averageRating = totalRatings > 0 ? (totalRating / totalRatings).toFixed(2) : 0;

        // Create the summary entry
        const summary = new Summary({
            groupId,
            groupName,
            averageRating,
            participantCount,
        });

        // Save the summary to the database
        await summary.save();
    } catch (error) {
        console.error('Error generating summary:', error);
    }
};

module.exports = router;
