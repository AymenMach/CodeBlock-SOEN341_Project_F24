import React from 'react';
import DisplayGroups from './DisplayGroups';
import './StudentDashboard.css';
import axios from 'axios';

const StudentDashboard = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Fetch teams for student
    axios.get('/api/teams/student')
      .then(response => setTeams(response.data))
      .catch(error => console.error('Error fetching teams:', error));
  }, []);

  return (
    <div>
      <h2>Your Teams</h2>
      <ul>
        {teams.map((team, index) => (
          <li key={index}>{team.name} - Members: {team.members.join(', ')}</li>
        ))}
      </ul>
    </div>
  );
};

export default StudentDashboard;
