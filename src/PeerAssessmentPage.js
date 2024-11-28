import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PeerAssessmentPage.css';
import { useUser } from './UserContext';

const PeerAssessmentPage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState({});
    const [comments, setComments] = useState({});
    const { currentUser } = useUser();
    const [currentUserId, setCurrentUserId] = useState(null);
    const [peerAssessmentEnabled, setPeerAssessmentEnabled] = useState(true); 

    useEffect(() => {
        if (currentUser) {
            setCurrentUserId(currentUser._id);
        }
    }, [currentUser]);

    useEffect(() => {
        const fetchPeerAssessmentSetting = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/peer-assessment-settings');
                if (!response.ok) throw new Error('Failed to fetch peer assessment settings');
                
                const data = await response.json();
                if (data.length > 0) {
                    const latestSettings = data[0]; 
                    setPeerAssessmentEnabled(latestSettings.isEnabled); 

                    if (!latestSettings.isEnabled) {
                        alert('Peer assessments are currently disabled.');
                        navigate('/student-page'); 
                    }
                }
            } catch (error) {
                console.error('Error fetching peer assessment settings:', error);
                alert('An error occurred while checking peer assessment settings.');
            }
        };

        fetchPeerAssessmentSetting();
    }, [groupId, navigate]); 

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/groups/${groupId}/participants`);
                if (!response.ok) throw new Error('Failed to fetch group participants');
                
                const participantIds = await response.json();
                const usersResponse = await fetch('http://localhost:5000/api/users');
                const usersData = await usersResponse.json();

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
        if (!peerAssessmentEnabled) {
            alert('Peer assessments are currently disabled.');
            navigate('/student-page'); 
            return;
        }

        const rating = selectedRatings[member._id];
        if (!rating || !rating.cooperation || !rating.conceptual || !rating.practical || !rating.workEthic) {
            alert("Please fill in all ratings before submitting.");
            return;
        }
    
        const newRating = {
            memberId: member._id,
            cooperation: Number(rating.cooperation),
            conceptual: Number(rating.conceptual) || 0,
            practical: Number(rating.practical) || 0,
            workEthic: Number(rating.workEthic) || 0,
            feedback: {
                cooperation: comments[member._id]?.cooperation || '',
                conceptual: comments[member._id]?.conceptual || '',
                practical: comments[member._id]?.practical || '',
                workEthic: comments[member._id]?.workEthic || ''
            }
        };
    
        console.log("Submitted Evaluation Data:", newRating);
    
        if (!currentUserId) {
            alert("You must be logged in to submit an assessment.");
            return;
        }
    
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
    
            alert('Assessment submitted successfully!');
    
            navigate('/student-page');
        } catch (error) {
            console.error('Error submitting assessment:', error);
            alert('An error occurred while submitting the assessment.');
        }
    };

    const handleRatingChange = (memberId, category, value) => {
        setSelectedRatings((prev) => ({
            ...prev,
            [memberId]: {
                ...prev[memberId],
                [category]: value,
            },
        }));
    };

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
            <button onClick={() => navigate('/student-page')} className="back-button">Back to Student Page</button>
            <table className="peer-assessment-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>ID</th>
                        <th>Cooperation Rating & Comment</th>
                        <th>Conceptual Contribution & Comment</th>
                        <th>Practical Contribution & Comment</th>
                        <th>Work Ethic & Comment</th>
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

                                {['cooperation', 'conceptual', 'practical', 'workEthic'].map((category) => (
                                    <td key={category}>
                                        <select
                                            value={selectedRatings[member._id]?.[category] || ''}
                                            onChange={(e) => handleRatingChange(member._id, category, e.target.value)}
                                        >
                                            <option value="">Select Rating</option>
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <option key={value} value={value}>{value}</option>
                                            ))}
                                        </select>
                                        <textarea
                                            value={comments[member._id]?.[category] || ''}
                                            onChange={(e) => handleCommentChange(member._id, category, e.target.value)}
                                            placeholder={`Add comment for ${category}`}
                                        />
                                    </td>
                                ))}

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
