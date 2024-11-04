import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PeerAssessmentPage.css';

const PeerAssessmentPage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [selectedRatings, setSelectedRatings] = useState({});
    const [comments, setComments] = useState({});
    const [currentUserId, setCurrentUserId] = useState(null); 

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

    // Handle rating selection for each member
    const handleEvaluate = async (member) => {
        console.log("Selected Ratings:", selectedRatings); 

        const rating = selectedRatings[member._id];

        if (!rating || !rating.conceptual || !rating.practical || !rating.workEthic) {
            alert("Please select ratings before submitting.");
            return;
        }

        const comment = comments[member._id] || '';

        const newRating = {
            memberId: member._id,
            conceptual: rating.conceptual,
            practical: rating.practical,
            workEthic: rating.workEthic,
            comments: comment
        };

        try {
            const response = await fetch(`http://localhost:5000/api/assessments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    groupId,
                    assessorId: currentUserId,
                    ratings: [newRating]
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
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

    // Handle rating change for each category
    const handleRatingChange = (memberId, category, value) => {
        setSelectedRatings((prev) => ({
            ...prev,
            [memberId]: {
                ...prev[memberId],
                [category]: value,
            },
        }));
    };

    // Handle comment change for each participant
    const handleCommentChange = (memberId, value) => {
        setComments((prev) => ({
            ...prev,
            [memberId]: value,
        }));
    };

    return (
        <div className="peer-assessment-container">
            <h1>Peer Assessment</h1>
            <h2 style={{ textAlign: 'center' }}>Group: {groupName}</h2>
            <button className="back-button" onClick={() => navigate('/student-page')}>Back to Groups</button>
            <table className="peer-assessment-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>ID</th> {}
                        <th>Conceptual Contribution</th>
                        <th>Practical Contribution</th>
                        <th>Work Ethic</th>
                        <th>Comments</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {members.length === 0 ? (
                        <tr>
                            <td colSpan="7">No members available</td> {}
                        </tr>
                    ) : (
                        members.map((member) => (
                            <tr key={member._id}>
                                <td>{member.name}</td> {}
                                <td>{member._id}</td> {}
                                <td>
                                    {member._id !== currentUserId ? (
                                        <select
                                            value={selectedRatings[member._id]?.conceptual || ''}
                                            onChange={(e) => handleRatingChange(member._id, 'conceptual', e.target.value)}
                                        >
                                            <option value="">Select Rating</option>
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <option key={value} value={value}>{value}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </td>
                                <td>
                                    {member._id !== currentUserId ? (
                                        <select
                                            value={selectedRatings[member._id]?.practical || ''}
                                            onChange={(e) => handleRatingChange(member._id, 'practical', e.target.value)}
                                        >
                                            <option value="">Select Rating</option>
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <option key={value} value={value}>{value}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </td>
                                <td>
                                    {member._id !== currentUserId ? (
                                        <select
                                            value={selectedRatings[member._id]?.workEthic || ''}
                                            onChange={(e) => handleRatingChange(member._id, 'workEthic', e.target.value)}
                                        >
                                            <option value="">Select Rating</option>
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <option key={value} value={value}>{value}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </td>
                                <td>
                                    {member._id !== currentUserId ? (
                                        <textarea
                                            value={comments[member._id] || ''}
                                            onChange={(e) => handleCommentChange(member._id, e.target.value)}
                                            placeholder="Add your comments"
                                        />
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </td>
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
