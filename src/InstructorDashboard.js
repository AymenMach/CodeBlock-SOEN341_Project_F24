import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [peerAssessmentMessages, setPeerAssessmentMessages] = useState([]);
  const [isPeerAssessmentVisible, setIsPeerAssessmentVisible] = useState(false); 

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'instructor') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // get groups
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

  
  useEffect(() => {
    const fetchPeerAssessmentMessages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/peer-assessment-settings');
        if (!response.ok) {
          throw new Error('Failed to fetch peer assessment settings');
        }
        const data = await response.json();
        setPeerAssessmentMessages(data);
      } catch (error) {
        console.error('Error fetching peer assessment messages:', error);
      }
    };

    fetchPeerAssessmentMessages();
  }, []);

  // show or hide the history
  const togglePeerAssessmentVisibility = () => {
    setIsPeerAssessmentVisible(!isPeerAssessmentVisible);
  };

  // makes the page look "better"
  const styles = {
    instructorDashboard: {
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    mainContainer: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    sidebar: {
      width: '25%',
      padding: '20px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
    },
    sidebarButton: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    sidebarButtonHover: {
      backgroundColor: '#45a049',
    },
    contentArea: {
      width: '70%',
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
    },
    peerAssessmentActions: {
      display: 'flex',
      flexDirection: 'row',
      gap: '10px',
      marginBottom: '20px',
    },
    peerAssessmentButton: {
      flex: 1,
      padding: '10px',
      backgroundColor: '#008CBA',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    peerAssessmentButtonHover: {
      backgroundColor: '#005f6b',
    },
    peerAssessmentHistory: {
      marginTop: '20px',
    },
  };

  return (
    <div style={styles.instructorDashboard}>
      <h1 style={styles.header}>Welcome, {currentUser.username}</h1>
      <div>
        <button
          style={styles.sidebarButton}
          onClick={() => navigate('/instructor-dashboard/groups')}
        >
          Manage Groups
        </button>
        <h2>Peer Assessments</h2>
        <div style={styles.peerAssessmentActions}>
          {groups.length > 0 ? (
            <button
              style={styles.peerAssessmentButton}
              onClick={() => navigate('/instructor-dashboard/peer-assessments/detailed')}
            >
              View Detailed View for All Groups
            </button>
          ) : (
            <p>No groups available</p>
          )}
          <button
            style={styles.peerAssessmentButton}
            onClick={() => navigate('/instructor-dashboard/peer-assessments/summary')}
          >
            Summary View
          </button>
          <button
            style={styles.peerAssessmentButton}
            onClick={togglePeerAssessmentVisibility}
          >
            {isPeerAssessmentVisible ? 'Hide Peer Assessment History' : 'Show Peer Assessment History'}
          </button>
        </div>
        {isPeerAssessmentVisible && (
          <div style={styles.peerAssessmentHistory}>
            <h3>Peer Assessment History</h3>
            {peerAssessmentMessages.length > 0 ? (
              <ul>
                {peerAssessmentMessages.map((message, index) => (
                  <li key={index}>
                    <strong>{message.isEnabled ? 'Enabled' : 'Disabled'}</strong>:
                    {message.message}
                    <br />
                    <small>Timestamp: {new Date(message.timestamp).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No peer assessment history available.</p>
            )}
          </div>
        )}

        <div>
          <button
            style={styles.sidebarButton}
            onClick={() => navigate('/instructor-dashboard/students')}
          >
            List of Students
          </button>
        </div>
        <div>
          <button
            style={styles.sidebarButton}
            onClick={() => navigate('/instructor-dashboard/peer-assessments/settings')}
          >
            Peer Assessment Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
