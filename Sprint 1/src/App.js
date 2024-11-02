import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import GroupDetailPage from './GroupDetailPage'; // Import the new component


// Start of welcome page
const PeerAssessment = () => {
  const [isStudent, setIsStudent] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleStudentChange = () => {
    setIsStudent(!isStudent);
    if (isInstructor) setIsInstructor(false);
  };

  const handleInstructorChange = () => {
    setIsInstructor(!isInstructor);
    if (isStudent) setIsStudent(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.message || 'Login failed');
        return;
      }

      const data = await response.json();
      console.log('Login successful:', data);

      // Role checking logic
      if (data.role === 'instructor' && isInstructor) {
        navigate('/instructor-page');
      } else if (data.role === 'student' && isStudent) {
        navigate('/student-page');
      } else {
        alert('Role mismatch. Please ensure your selected role matches your credentials.');
      }

    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <div className="peer-assessment">
      <img src="https://crypto.quebec/wp-content/uploads/2016/03/concordia.jpg" alt="Concordia University Logo" className="logo concordia-logo" />
      <div className="content">
        <h1>PEER ASSESSMENT SYSTEM</h1>
        <div className="checkbox-group">
          <label>Are you a(n):</label>
          <label>
            <input type="checkbox" checked={isStudent} onChange={handleStudentChange} />
            Student
          </label>
          <label>
            <input type="checkbox" checked={isInstructor} onChange={handleInstructorChange} />
            Instructor
          </label>
        </div>
        {(isStudent || isInstructor) && (
          <div className="credentials">
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSubmit}>Enter</button>
          </div>
        )}
      </div>
    </div>
  );
};

// Group Page
const GroupPage = ({ isInstructor }) => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate()

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
        console.error('Error parsing JSON:', error);
        alert('An error occurred while fetching groups. Please try again.');
      }
    };

    fetchGroups();
  }, []);

  const handlePeerAssessment = (groupId) => {
    console.log(`Initiating peer assessment for group: ${groupId}`);
    // Implement your peer assessment logic here
  };

  return (
    <div>
      <h1>Groups</h1>
      {groups.map(group => (
        <div key={group._id}>
          <h2>{group.name}</h2>
          <ul>
            {group.students.map(student => (
              <li key={student._id}>{student.username}</li>
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

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [users, setUsers] = useState([]); // State to hold the list of users
  const [selectedUsers, setSelectedUsers] = useState({}); // State to hold selected user for each group
  const [showDropdown, setShowDropdown] = useState({}); // State to control dropdown visibility for each group

  // Fetch existing groups and users when component mounts
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

  // Filter out users who are already added to any group
  const unavailableUsers = groups.reduce((acc, group) => {
    return acc.concat(group.participants);
  }, []);

  // Update availableUsers to filter by full name instead of username
  const availableUsers = users.filter(user => 
    !unavailableUsers.includes(user.name) 
  );

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
        alert('Failed to create group. Please check the console for more details.');
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
    const selectedUser = selectedUsers[groupId];
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
      setSelectedUsers({ ...selectedUsers, [groupId]: '' }); 
      setShowDropdown({ ...showDropdown, [groupId]: false }); 
    } catch (error) {
      console.error('Error adding participant:', error);
      alert('An error occurred while adding the participant.');
    }
  };

  const toggleDropdown = (groupId) => {
    setShowDropdown(prev => ({ ...prev, [groupId]: !prev[groupId] }));
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
          <button onClick={() => toggleDropdown(group._id)}>Add a participant</button>
          {showDropdown[group._id] && (
            <div className="dropdown">
              <select 
                value={selectedUsers[group._id] || ''} 
                onChange={(e) => setSelectedUsers({ ...selectedUsers, [group._id]: e.target.value })}>
                <option value="">Select a participant</option>
                {availableUsers.map(user => (
                  <option key={user._id} value={user.name}>{user.name}</option> 
                ))}
              </select>
              <button onClick={() => handleAddParticipant(group._id)}>Add</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


// Start of student page
const StudentPage = () => {
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
    navigate(`/group/${groupId}`);
    // Implement your peer assessment logic here
  };

  return (
    <div className="group-management">
      <img src="https://crypto.quebec/wp-content/uploads/2016/03/concordia.jpg" alt="Concordia University Logo" className="logo concordia-logo" />
      <h1>Groups</h1>
      {groups.length === 0 ? (
        <p>No groups available.</p>
      ) : (
        groups.map(group => (
          <div key={group._id} className="group">
            <h2>{group.name}</h2>
            <table>
              <thead>
                <tr>
                  <th>Participants</th>
                </tr>
              </thead>
              <tbody>
                {group.participants.map((participant, index) => (
                  <tr key={index}>
                    <td>{participant}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => handlePeerAssessment(group._id)}>Peer Assessment</button>
          </div>
        ))
      )}
    </div>
  );
};

const InstructorPage = () => <GroupPage isInstructor={true} />;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PeerAssessment />} />
        <Route path="/instructor-page" element={<GroupManagement />} />
        <Route path="/student-page" element={<StudentPage />} />
        <Route path="/group/:groupId" element={<GroupDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;
