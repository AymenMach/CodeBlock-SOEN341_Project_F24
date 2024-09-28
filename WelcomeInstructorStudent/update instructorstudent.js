import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css'; 

// start of welcome page
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
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
      if (data.role === 'instructor') {
        navigate('/instructor-page');
      } else if (data.role === 'student') {
        navigate('/student-page');
      }
    } else {
      alert('Invalid credentials or role');
    }
  };

  return (
    <div className="peer-assessment">
      <img src="https://crypto.quebec/wp-content/uploads/2016/03/concordia.jpg" alt="Concordia University Logo" className="logo concordia-logo" />
      <div className="content">
        <h1>PEER ASSESSMENT SYSTEM</h1>
        <div className="checkbox-group">
          <label>
            Are you a(n):
          </label>
          <label>
            <input
              type="checkbox"
              checked={isStudent}
              onChange={handleStudentChange}
            />
            Student
          </label>
          <label>
            <input
              type="checkbox"
              checked={isInstructor}
              onChange={handleInstructorChange}
            />
            Instructor
          </label>
        </div>
        {(isStudent || isInstructor) && (
          <div className="credentials">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSubmit}>Enter</button>
          </div>
        )}
      </div>
    </div>
  );
};
// end of welcome page

// start of instructor page
const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      const response = await fetch('/api/groups');
      const groupsData = await response.json();
      setGroups(groupsData);
    };
    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    const response = await fetch('/api/groups/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupname: newGroupName })
    });

    if (response.ok) {
      const newGroup = await response.json();
      setGroups([...groups, newGroup]);
      setNewGroupName('');
    } else {
      alert('Error creating group');
    }
  };

  const handleAddParticipant = async (groupIndex) => {
    const participantName = prompt('Enter participant name:');
    if (participantName) {
      const groupId = groups[groupIndex]._id;
      const response = await fetch('/api/groups/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupID: groupId, studentID: participantName })
      });

      if (response.ok) {
        const updatedGroup = await response.json();
        const updatedGroups = [...groups];
        updatedGroups[groupIndex] = updatedGroup;
        setGroups(updatedGroups);
      } else {
        alert('Error assigning student to group');
      }
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
              {group.students.map((participant, pIndex) => (
                <tr key={pIndex}>
                  <td>{participant.username}</td>
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
// end of instructor page

// start of student page
const StudentPage = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const response = await fetch('/api/groups');
      const groupsData = await response.json();
      setGroups(groupsData);
    };
    fetchGroups();
  }, []);

  return (
    <div className="student-page">
      <img src="https://crypto.quebec/wp-content/uploads/2016/03/concordia.jpg" alt="Concordia University Logo" className="logo concordia-logo" />
      <h1>Groups</h1>
      {groups.map((group) => (
        <div key={group._id}>
          <h2>{group.name}</h2>
          <ul>
            {group.students.map((student) => (
              <li key={student._id}>{student.username}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
// end of student page

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PeerAssessment />} />
        <Route path="/instructor-page" element={<GroupManagement />} />
        <Route path="/student-page" element={<StudentPage />} />
      </Routes>
    </Router>
  );
};

export default App;
