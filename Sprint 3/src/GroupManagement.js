import React, { useState, useEffect } from 'react';

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [showDropdown, setShowDropdown] = useState({});

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/groups');
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        const groupsData = await response.json();
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching groups:', error);
        alert('An error occurred while fetching groups.');
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

    fetchGroups();
    fetchUsers();
  }, []);

  const handleCreateGroup = async () => {
    const newGroup = { name: newGroupName, participants: [] };
    try {
      const response = await fetch('http://localhost:5000/api/groups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGroup),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error creating group:', errorText);
        alert('Failed to create group.');
        return;
      }

      const savedGroup = await response.json();
      setGroups([...groups, savedGroup]);
      setNewGroupName('');
    } catch (error) {
      console.error('Error creating group:', error);
      alert('An error occurred while creating the group.');
    }
  };

  const handleAddParticipant = async (groupId) => {
    if (!selectedUser) {
      alert('Please select a participant.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/groups/add-participant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, participantName: selectedUser }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add participant');
        return;
      }

      const updatedGroup = await response.json();
      setGroups(groups.map(group => (group._id === updatedGroup._id ? updatedGroup : group)));
      setSelectedUser(''); 
      setShowDropdown({ ...showDropdown, [groupId]: false }); 
    } catch (error) {
      console.error('Error adding participant:', error);
      alert('An error occurred while adding the participant.');
    }
  };

  const handleRemoveParticipant = async (groupId, participantName) => {
    try {
      const response = await fetch('http://localhost:5000/api/groups/remove-participant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, participantName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to remove participant');
        return;
      }

      const updatedGroup = await response.json();
      setGroups(groups.map(group => (group._id === updatedGroup._id ? updatedGroup : group)));
    } catch (error) {
      console.error('Error removing participant:', error);
      alert('An error occurred while removing the participant.');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error deleting group:', errorText);
          alert('Failed to delete group.');
          return;
        }

        setGroups(groups.filter(group => group._id !== groupId));
        alert('Group deleted successfully.');
      } catch (error) {
        console.error('Error deleting group:', error);
        alert('An error occurred while deleting the group.');
      }
    }
  };

  return (
    <div className="group-management">
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
      {groups.map(group => (
        <div key={group._id} className="group">
          <h2>{group.name}</h2>
          <table>
            <thead>
              <tr>
                <th>Participants</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {group.participants.map((participant, pIndex) => (
                <tr key={pIndex}>
                  <td>{participant}</td>
                  <td>
                    <button onClick={() => handleRemoveParticipant(group._id, participant)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setShowDropdown({ ...showDropdown, [group._id]: !showDropdown[group._id] })}>
            {showDropdown[group._id] ? 'Hide' : 'Add a participant'}
          </button>
          {showDropdown[group._id] && (
            <div className="dropdown">
              <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="">Select a participant</option>
                {users
                  .filter(user => !groups.some(g => g.participants.includes(user.name))) 
                  .map(user => (
                    <option key={user._id} value={user.name}>{user.name}</option>
                  ))}
              </select>
              <button onClick={() => handleAddParticipant(group._id)}>Add</button>
            </div>
          )}
          <button onClick={() => handleDeleteGroup(group._id)}>Delete Group</button>
        </div>
      ))}
    </div>
  );
};

export default GroupManagement;
