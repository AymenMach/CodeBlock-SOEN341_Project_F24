import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GroupPage = ({ isInstructor }) => {
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
    console.log(`Initiating peer assessment for group: ${groupId}`);
  };

  return (
    <div>
      <h1>Groups</h1>
      {groups.map(group => (
        <div key={group._id}>
          <h2>{group.name}</h2>
          <ul>
            {group.participants.map(participant => (
              <li key={participant._id}>{participant.username}</li>
            ))}
          </ul>
          <button onClick={() => handlePeerAssessment(group._id)}>Peer Assessment</button>
        </div>
      ))}
      {isInstructor && (
        <>
          <button onClick={() => console.log("Create Group Logic")}>Create Group</button>
          <button onClick={() => console.log("Assign Students Logic")}>Assign Students</button>
        </>
      )}
    </div>
  );
};

export default GroupPage;
