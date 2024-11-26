import React, { useState } from 'react';
import './InstructorPage.css'; 

const App = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateGroup = () => {
    const newGroup = {
      name: newGroupName,
      participants: [],
    };
    setGroups([...groups, newGroup]);
    setNewGroupName('');
  };

  const handleAddParticipant = (groupIndex) => {
    const participantName = prompt('Enter participant name:');
    if (participantName) {
      const updatedGroups = [...groups];
      updatedGroups[groupIndex].participants.push(participantName);
      setGroups(updatedGroups);
    }
  };

  return (
    <div className="group-management">
      <img src="https://crypto.quebec/wp-content/uploads/2016/03/concordia.jpg" alt="Concordia University Logo" className="logo concordia-logo" />
      <h1>Group Management</h1>
      <div className="create-group">
        <label>
          Group name:
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
        </label>
        <button onClick={handleCreateGroup}>Create a new group</button>
      </div>
      {groups.map((group, index) => (
        <div key={index} className="group">
          <h2>{group.name}</h2>
          <table>
            <thead>
              <tr>
                <th>Participants</th>
              </tr>
            </thead>
            <tbody>
              {group.participants.map((participant, pIndex) => (
                <tr key={pIndex}>
                  <td>{participant}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => handleAddParticipant(index)}>Add a participant</button>
        </div>
      ))}
    </div>
  );
};

export default App;
