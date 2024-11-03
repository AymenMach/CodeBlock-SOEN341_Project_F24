import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentPage = () => {
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/groups');

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error fetching groups:', errorText);
                    alert('Failed to fetch groups. Please check the console for more details.');
                    return;
                }

                const groupsData = await response.json();
                setGroups(groupsData);
            } catch (error) {
                console.error('Error fetching groups:', error);
                alert('An error occurred while fetching groups. Please try again.');
            }
        };

        fetchGroups();
    }, []);

    const handlePeerAssessment = (groupId) => {
        navigate(`/peer-assessment/${groupId}`);
    };

    return (
        <div className="group-management">
            <img src="https://crypto.quebec/wp-content/uploads/2016/03/concordia.jpg" alt="Concordia University Logo" className="logo concordia-logo" />
            <h1>Groups</h1>
            {groups.length === 0 ? (
                <p>No groups available.</p>
            ) : (
                groups.map(group => (
                    <div key={group._id} className="group">
                        <h2>{group.name}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Participants</th>
                                </tr>
                            </thead>
                            <tbody>
                                {group.participants.map((participant, index) => (
                                    <tr key={index}>
                                        <td>{participant}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={() => handlePeerAssessment(group._id)}>Peer Assessment</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default StudentPage;
