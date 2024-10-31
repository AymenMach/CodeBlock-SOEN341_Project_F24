import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

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

// Start of instructor page
const GroupManagement = () => {
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

// Start of student page
const StudentPage = () => {
  return (
    <div className="student-page">
      <img src="https://crypto.quebec/wp-content/uploads/2016/03/concordia.jpg" alt="Concordia University Logo" className="logo concordia-logo" />
      <h1>Groups</h1>
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
      </Routes>
    </Router>
  );
};

export default App;