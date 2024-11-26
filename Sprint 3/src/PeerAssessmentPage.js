import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PeerAssessmentPage.css';
import { useUser } from './UserContext'; // Import useUser hook

const PeerAssessmentPage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState({});
    const [comments, setComments] = useState({});
    const { currentUser } = useUser(); // Access the currentUser from context
    const [currentUserId, setCurrentUserId] = useState(null); 

    // Log currentUser and currentUserId to debug
    useEffect(() => {
        console.log('currentUser from context:', currentUser);  // Log the currentUser object
        
        if (currentUser) {
            setCurrentUserId(currentUser._id);  // Assuming the currentUser has an _id field
            console.log('Set currentUserId:', currentUser._id);  // Log when the ID is set
        }
    }, [currentUser]);

    // Fetch group members and participants
    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/groups/${groupId}/participants`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch group participants');
                }
                
                const participantIds = await response.json();
                console.log('Fetched participant IDs:', participantIds); 
        
                // Now fetch user details for each ID
                const usersResponse = await fetch('http://localhost:5000/api/users'); 
                const usersData = await usersResponse.json();
                console.log('Fetched users:', usersData); 
        
                // Map participant IDs to user names
                const formattedMembers = participantIds.map(id => {
                    const user = usersData.find(user => user.studentId === id); 
                    return {
                        _id: id,
                        name: user ? user.name : 'Unknown', 
                    };
                });
        
                setMembers(formattedMembers);
        
            } catch (error) {
                console.error('Error fetching group members:', error);
            }
        };

        fetchGroupMembers();
    }, [groupId]);

    const handleEvaluate = async (member) => {
        console.log("Selected Ratings:", selectedRatings);
        
        const rating = selectedRatings[member._id];
        
        if (!rating || !rating.cooperation) {
            alert("Please select a cooperation rating before submitting.");
            return;
        }

        // Prepare ratings and comments
        const newRating = {
            memberId: member._id,
            cooperation: Number(rating.cooperation),
            conceptual: comments[member._id]?.conceptual || '',
            practical: comments[member._id]?.practical || '',
            workEthic: comments[member._id]?.workEthic || ''
        };

        console.log("New Rating:", newRating);
    
        // Log currentUserId to check if it's null
        console.log("Current User ID:", currentUserId);
    
        // Ensure currentUserId is not null before submitting
        if (!currentUserId) {
            alert("You must be logged in to submit an assessment.");
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:5000/api/assessments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    groupId, // Use groupId from the component
                    assessorId: currentUserId,  // The ID of the logged-in user (assessor)
                    ratings: [newRating] // The ratings for the member
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error Response:', errorData);
                alert(errorData?.message || 'Failed to submit assessment');
                return;
            }
    
            const data = await response.json();
            console.log('Assessment submitted successfully:', data);
            alert('Assessment submitted successfully!');
        } catch (error) {
            console.error('Error submitting assessment:', error);
            alert('An error occurred while submitting the assessment.');
        }
    };

    // Handle cooperation rating change
    const handleCooperationRatingChange = (memberId, value) => {
        setSelectedRatings((prev) => ({
            ...prev,
            [memberId]: {
                ...prev[memberId],
                cooperation: value,
            },
        }));
    };

    // Handle comment change for each category
    const handleCommentChange = (memberId, category, value) => {
        setComments((prev) => ({
            ...prev,
            [memberId]: {
                ...prev[memberId],
                [category]: value,
            },
        }));
    };

    return (
        <div className="peer-assessment-container">
            <h1>Peer Assessment</h1>
            <table className="peer-assessment-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>ID</th>
                        <th>Cooperation Rating</th>
                        <th>Conceptual Contribution</th>
                        <th>Practical Contribution</th>
                        <th>Work Ethic</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {members.length === 0 ? (
                        <tr>
                            <td colSpan="7">No members available</td>
                        </tr>
                    ) : (
                        members.map((member) => (
                            <tr key={member._id}>
                                <td>{member.name}</td>
                                <td>{member._id}</td>

                                {/* Cooperation Rating */}
                                <td>
                                    <select
                                        value={selectedRatings[member._id]?.cooperation || ''}
                                        onChange={(e) => handleCooperationRatingChange(member._id, e.target.value)}
                                    >
                                        <option value="">Select Rating</option>
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <option key={value} value={value}>{value}</option>
                                        ))}
                                    </select>
                                </td>

                                {/* Conceptual Contribution */}
                                <td>
                                    <textarea
                                        value={comments[member._id]?.conceptual || ''}
                                        onChange={(e) => handleCommentChange(member._id, 'conceptual', e.target.value)}
                                        placeholder="Add your comments"
                                    />
                                </td>

                                {/* Practical Contribution */}
                                <td>
                                    <textarea
                                        value={comments[member._id]?.practical || ''}
                                        onChange={(e) => handleCommentChange(member._id, 'practical', e.target.value)}
                                        placeholder="Add your comments"
                                    />
                                </td>

                                {/* Work Ethic */}
                                <td>
                                    <textarea
                                        value={comments[member._id]?.workEthic || ''}
                                        onChange={(e) => handleCommentChange(member._id, 'workEthic', e.target.value)}
                                        placeholder="Add your comments"
                                    />
                                </td>

                                {/* Evaluate Button */}
                                <td>
                                    <button onClick={() => handleEvaluate(member)} disabled={member._id === currentUserId}>
                                        Evaluate
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PeerAssessmentPage;
