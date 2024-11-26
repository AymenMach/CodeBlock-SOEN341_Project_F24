import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

// Welcome/Login Page Component
const PeerAssessment = () => {
  const [isStudent, setIsStudent] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      if (data.role === 'instructor') {
        navigate('/instructor-page');
      } else if (data.role === 'student') {
        navigate('/student-page');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
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

// Group Page Component shared by Instructor and Student
const GroupPage = ({ isInstructor }) => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [studentIds, setStudentIds] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/groups');
        if (!response.ok) throw new Error('Failed to fetch groups');
        const groupsData = await response.json();
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching groups:', error);
        alert('Failed to fetch groups.');
      }
    };
    fetchGroups();
  }, []);

// Function to create a new group
  const createGroup = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/groups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: groupName })
      });
      if (!response.ok) throw new Error('Failed to create group');
      const newGroup = await response.json();
      setGroups([...groups, newGroup]);
      setGroupName('');
      alert('Group created successfully');
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Error creating group');
    }
  };

  // Function to assign students to a group
  const assignStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/groups/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId: selectedGroup, studentIds: studentIds.split(',') })
      });
      if (!response.ok) throw new Error('Failed to assign students');
      alert('Students assigned successfully');
      setStudentIds('');
    } catch (error) {
      console.error('Error assigning students:', error);
      alert('Error assigning students');
    }
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

// Instructor and Student Page Components
const InstructorPage = () => <GroupPage isInstructor={true} />;
const StudentPage = () => <GroupPage isInstructor={false} />;

// Main App Component with Routes
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
