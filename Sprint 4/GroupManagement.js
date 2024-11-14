import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ToastNotification from './Notification';

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [showDropdown, setShowDropdown] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const navigate = useNavigate();

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
        setToastMessage('Failed to create group.');
        setToastType('error');
        return;
      }

      const savedGroup = await response.json();
      setGroups([...groups, savedGroup]);
      setNewGroupName('');
      setToastMessage('Group created successfully!');
      setToastType('success');
    } catch (error) {
      console.error('Error creating group:', error);
      setToastMessage('An error occurred while creating the group.');
      setToastType('error');
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
        body: JSON.stringify({ groupId, studentId: selectedUser }),
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
      setToastMessage('Student added to the group successfully!');
      setToastType('success');
    } catch (error) {
      console.error('Error adding participant:', error);
      alert('An error occurred while adding the participant.');
      setToastMessage('An error occurred while adding the student.');
      setToastType('error');
    }
  };

  const handleRemoveParticipant = async (groupId, studentId) => {
    try {
      const response = await fetch('http://localhost:5000/api/groups/remove-participant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, studentId }),
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

  const handleReturnToDashboard = () => {
    navigate('/instructor-dashboard');
  };

  return (
    <div className="group-management">
      <h1>Group Management</h1>
      <button onClick={handleReturnToDashboard}>Return to Instructor Dashboard</button>

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
                <th>Name</th>
                <th>ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {group.participants.map((participantId, pIndex) => {
                const user = users.find(user => user.studentId === participantId);
                return (
                  <tr key={pIndex}>
                    <td>{user ? user.name : 'Unknown'}</td>
                    <td>{participantId}</td>
                    <td>
                      <button onClick={() => handleRemoveParticipant(group._id, participantId)}>Remove</button>
                    </td>
                  </tr>
                );
              })}
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
                  .filter(user => !groups.some(g => g.participants.includes(user.studentId)))
                  .map(user => (
                    <option key={user._id} value={user.studentId}>{user.studentId}</option>
                  ))}
              </select>
              <button onClick={() => handleAddParticipant(group._id)}>Add</button>
            </div>
          )}

          <button onClick={() => handleDeleteGroup(group._id)}>Delete Group</button>
        </div>
      ))}

      <ToastNotification
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default GroupManagement;
