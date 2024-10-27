
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

const PeerAssessment = () => {
  const [isStudent, setIsStudent] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle role selection
  const handleStudentChange = () => {
    setIsStudent(true);
    setIsInstructor(false);
  };

  const handleInstructorChange = () => {
    setIsInstructor(true);
    setIsStudent(false);
  };

  // Handle login action
  const handleSubmit = () => {
    // Placeholder login validation: here, any username/password is accepted
    if (isStudent) {
      navigate('/student-page');
    } else if (isInstructor) {
      navigate('/instructor-page');
    } else {
      alert('Please select a role');
    }
  };

  return (
    <div className="peer-assessment">
      <img
        src="https://crypto.quebec/wp-content/uploads/2016/03/concordia.jpg"
        alt="Concordia University Logo"
        className="logo concordia-logo"
      />
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
        {/* Display login form when a role is selected */}
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

// Basic placeholder components for student and instructor pages
const StudentPage = () => (
  <div className="student-page">
    <h1>Welcome, Student!</h1>
  </div>
);

const InstructorPage = () => (
  <div className="instructor-page">
    <h1>Welcome, Instructor!</h1>
  </div>
);

// Main App Component with routing setup
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PeerAssessment />} />
        <Route path="/student-page" element={<StudentPage />} />
        <Route path="/instructor-page" element={<InstructorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
