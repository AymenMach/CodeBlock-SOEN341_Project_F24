import React, { useState } from 'react';
import DisplayGroups from './DisplayGroups';
import './InstructorDashboard.css';
import axios from 'axios'; 

const InstructorDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    axios.get('/api/teams')
      .then(response => setTeams(response.data))
      .catch(error => console.error('Error fetching teams:', error));
  }, []);

  const handleCreateTeam = async () => {
    try {
      await axios.post('/api/teams', { name: newTeamName });
      setNewTeamName('');
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  return (
    <div>
      <h2>Instructor Dashboard</h2>
      <input 
        type="text" 
        placeholder="New Team Name" 
        value={newTeamName}
        onChange={(e) => setNewTeamName(e.target.value)} 
      />
      <button onClick={handleCreateTeam}>Create Team</button>
      <ul>
        {teams.map((team, index) => (
          <li key={index}>{team.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default InstructorDashboard;

