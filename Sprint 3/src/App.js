import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

import RegistrationPage from './RegistrationPage';
import PeerAssessmentPage from './PeerAssessmentPage';
import StudentPage from './StudentPage';
import GroupManagement from './GroupManagement';

import { UserProvider, useUser } from './UserContext'; // Import UserContext

const PeerAssessment = () => {
  const [isStudent, setIsStudent] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { setCurrentUser } = useUser(); // Use the UserContext to set the current user
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
      const endpoint = isInstructor
        ? 'http://localhost:5000/api/instructors/login'
        : 'http://localhost:5000/api/users/login';
    
      const response = await fetch(endpoint, {
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
      console.log('Login response data:', data); // Log to check the structure
    
      // Check if the response is for an instructor or student
      if (data && data.instructor) {
        const user = {
          _id: data.instructor._id,  // Use instructor's _id
          username: data.instructor.username,
          role: 'instructor',  // Define the role as instructor
        };
        setCurrentUser(user); // Update the context with the instructor data
        console.log('Instructor data set in context:', user);
        navigate('/instructor-page');
      } else if (data && data.student) {
        const user = {
          _id: data.student._id,  // Use student's _id
          username: data.student.username,
          role: 'student',  // Define the role as student
        };
        setCurrentUser(user); // Update the context with the student data
        console.log('Student data set in context:', user);
        navigate('/student-page');
      } else {
        console.log('Invalid user data:', data);
        alert('Invalid user data received.');
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
        {isStudent && (
          <button onClick={() => navigate('/register')}>Register</button>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PeerAssessment />} />
          <Route path="/instructor-page" element={<GroupManagement />} />
          <Route path="/student-page" element={<StudentPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/peer-assessment/:groupId" element={<PeerAssessmentPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
