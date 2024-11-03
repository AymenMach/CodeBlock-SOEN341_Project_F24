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
    const currentUserId = 'current-user-id-here'; 

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/groups/${groupId}/participants`);
                const data = await response.json();

                if (data) {
                    setGroupName(data.name); 
                    setMembers(data.participants || []); 
                }


                if (Array.isArray(data)) {
                    const formattedMembers = data.map((name, index) => ({
                        _id: index, 
                        name,
                    }));
                    setMembers(formattedMembers);
                } else {
                    console.error('Unexpected data format:', data);
                }
            } catch (error) {
                console.error('Error fetching group members:', error);
            }
        };

        fetchGroupMembers();
    }, [groupId]);

    const handleEvaluate = (memberId) => {
        const rating = selectedRatings[memberId];
        const comment = comments[memberId] || '';
        alert(`Evaluating ${memberId} with a rating of ${rating}`);
        
    };

    const handleRatingChange = (memberId, rating) => {
        setSelectedRatings((prev) => ({
            ...prev,
            [memberId]: rating,
        }));
    };


    const handleCommentChange = (memberId, value) => {
        setComments((prev) => ({
            ...prev,
            [memberId]: value,
        }));
    };


    return (
        <div className="peer-assessment-container">
            <h1>Peer Assessment</h1>
            <h2 style={{ textAlign: 'center' }}>Group: {groupName}</h2> {}
            <button className="back-button" onClick={() => navigate('/student-page')}>Back to Groups</button>
            <table className="peer-assessment-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Conceptual Contribution</th>
                        <th>Practical Contribution</th>
                        <th>Work Ethic</th>
                        <th>Comments</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member._id}>
                            <td>{member.name}</td>
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
                                <button onClick={() => handleEvaluate(member._id)} disabled={member._id === currentUserId}>
                                    Evaluate
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PeerAssessmentPage;
