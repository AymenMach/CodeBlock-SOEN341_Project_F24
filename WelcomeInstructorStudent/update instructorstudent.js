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
  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    // Check if the response is OK (status 200)
    if (!response.ok) {
      // Attempt to parse error message as JSON, otherwise show a generic error
      const errorData = await response.json().catch(() => null);
      alert(errorData?.message || 'Login failed');
      return;
    }

    // Parse the successful JSON response
    const data = await response.json();
    console.log('Login successful:', data);

    // Navigate to the respective page based on the user's role
    if (data.role === 'instructor') {
      navigate('/instructor-page');
    } else if (data.role === 'student') {
      navigate('/student-page');
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
            <input type="checkbox" checked={isStudent} onChange={() => { setIsStudent(!isStudent); setIsInstructor(false); }} />
            Student
          </label>
          <label>
            <input type="checkbox" checked={isInstructor} onChange={() => { setIsInstructor(!isInstructor); setIsStudent(false); }} />
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

// instructor and student group page
const GroupPage = ({ isInstructor }) => {
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
          <button onClick={/* Create Group Logic */}>Create Group</button>
          <button onClick={/* Assign Students Logic */}>Assign Students</button>
        </>
      )}
    </div>
  );
};

const StudentPage = () => <GroupPage isInstructor={false} />;
const InstructorPage = () => <GroupPage isInstructor={true} />;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PeerAssessment />} />
        <Route path="/instructor-page" element={<InstructorPage />} />
        <Route path="/student-page" element={<StudentPage />} />
      </Routes>
    </Router>
  );
};

export default App;
