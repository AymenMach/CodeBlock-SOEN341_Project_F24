import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/groups/${groupId}`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const groupData = await response.json();
        console.log('Fetched group data:', groupData); 
        setGroup(groupData);
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  if (!group) {
    return (
      <div>
        <p>Loading group details...</p>
        <p>Rate your teammates:</p>
        <p>1</p>
        <p>2</p>
        <p>3</p>
        <p>4</p>
        <p>5</p>
        <h2>Comments</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alpha</td>
              <td>Great collaboration!</td>
            </tr>
            <tr>
              <td>Beta</td>
              <td>Needs more organization.</td>
            </tr>
            <tr>
              <td>Team Gamma</td>
              <td>Excellent presentation!</td>
            </tr>
            <tr>
              <td>Delta</td>
              <td>Very creative approach.</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }


  // Hardcoded table data
  const commentsData = [
    { team: 'Alpha', comments: 'Great collaboration!' },
    { team: 'Beta', comments: 'Needs more organization.' },
    { team: 'Gamma', comments: 'Excellent presentation!' },
    { team: 'Delta', comments: 'Very creative approach.' },
  ];

  return (
    <div>
      <h1>{group.name}</h1>
      <h2>Participants</h2>
      <ul>
        {group.participants.map((participant, index) => (
          <li key={index}>{participant}</li>
        ))}
      </ul>

      <h2>Comments</h2>
      <table>
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {commentsData.map((item, index) => (
            <tr key={index}>
              <td>{item.team}</td>
              <td>{item.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GroupDetailPage;
