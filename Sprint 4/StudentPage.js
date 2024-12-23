import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import './StudentPage.css';

const StudentPage = () => {
    const { currentUser } = useUser();
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshStatus, setRefreshStatus] = useState(null);
    const navigate = useNavigate();

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

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const usersData = await response.json();
            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('An error occurred while fetching users.');
        }
    };

    useEffect(() => {
        fetchGroups();
        fetchUsers();
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        setRefreshStatus(null);

        await Promise.all([fetchGroups(), fetchUsers()]);

        setIsRefreshing(false);
        setRefreshStatus('success');
        setTimeout(() => setRefreshStatus(null), 2000);
    };

    const handlePeerAssessment = (groupId) => {
        navigate(`/peer-assessment/${groupId}`);
    };

    const getUserNameById = (id) => {
        const user = users.find(user => user.studentId === id);
        return user ? user.name : 'Unknown';
    };

    return (
        <div className="group-management">
            <img src="https://crypto.quebec/wp-content/uploads/2016/03/concordia.jpg" alt="Concordia University Logo" className="logo concordia-logo" />
            <h1>Groups</h1>

            <div className="refresh-container">
                <button onClick={handleRefresh} className={`refresh-button ${isRefreshing ? 'loading' : ''}`} disabled={isRefreshing}>
                    {isRefreshing ? (
                        <div className="spinner"></div>
                    ) : (
                        'Refresh'
                    )}
                </button>

                {refreshStatus === 'success' && (
                    <span className="refresh-status success">Data Updated!</span>
                )}
            </div>

            {groups.length === 0 ? (
                <p>No groups available.</p>
            ) : (
                groups.map(group => {
                    const isCurrentUserInGroup = group.participants.includes(currentUser._id);

                    return (
                        <div key={group._id} className="group">
                            <h2>{group.name}</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {group.participants.map((participantId, index) => (
                                        <tr key={index}>
                                            <td>{getUserNameById(participantId)}</td>
                                            <td>{participantId}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {isCurrentUserInGroup && (
                                <button onClick={() => handlePeerAssessment(group._id)}>
                                    Peer Assessment
                                </button>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default StudentPage;
