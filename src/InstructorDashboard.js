import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'instructor') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/groups');
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="instructor-dashboard">
      <h1>Welcome, {currentUser.username}</h1>
      <div>
        <button onClick={() => navigate('/instructor-dashboard/groups')}>Manage Groups</button>
        <h2>Peer Assessments</h2>
        <div>
          {groups.length > 0 ? (
            <button onClick={() => navigate('/instructor-dashboard/peer-assessments/detailed')}>
              View Detailed View for All Groups
            </button>
          ) : (
            <p>No groups available</p>
          )}
          <button onClick={() => navigate('/instructor-dashboard/peer-assessments/summary')}>
            Summary View
          </button>
        </div>
        <div>
          <button onClick={() => navigate('/instructor-dashboard/students')}>
            List of Students
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
