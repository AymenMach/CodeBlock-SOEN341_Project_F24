import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css'; 
// start of welcome page
const PeerAssessment = () => {
  console.log('Rendering PeerAssessment');
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

  const handleSubmit = () => {
    if (username === 'Aymen' && password === '40250403' && isInstructor) {
      navigate('/instructor-page'); 
    } else if (username === 'Nihal' && password === '40250403' && isStudent) {
      navigate('/student-page');
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
  console.log('Rendering GroupManagement');
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
// end of instructor page
// start of student page
const StudentPage = () => {
  console.log('Rendering StudentPage');
  return (
    <div className="student-page">
      <img src="https://crypto.quebec/wp-content/uploads/2016/03/concordia.jpg" alt="Concordia University Logo" className="logo concordia-logo" />
      <h1>Groups</h1>
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
