import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

import RegistrationPage from './RegistrationPage';
import PeerAssessmentPage from './PeerAssessmentPage';
import StudentPage from './StudentPage';
import GroupManagement from './GroupManagement';
import InstructorDashboard from './InstructorDashboard.js';
import DetailedView from './DetailedView';
import SummaryView from './SummaryView';
import { UserProvider, useUser } from './UserContext';
import NavigationBar from './NavigationBar';
import ListOfStudentsPage from './ListOfStudentsPage';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return currentUser ? children : null;
};

const PeerAssessment = () => {
  const [isStudent, setIsStudent] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { setCurrentUser } = useUser();
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
  
      if (data.instructor) {
        const instructor = data.instructor;
        const user = {
          name: instructor.name,
          _id: instructor._id,
          username: instructor.username,
          role: 'instructor',
        };
        setCurrentUser(user);
        navigate('/instructor-dashboard');
      } 
      else if (data.role === 'student') {
        const user = {
          _id: data.studentId,
          username: data.username,
          role: 'student',
        };
        setCurrentUser(user);
        navigate('/student-page');
      } else {
        alert('Invalid user data received.');
      }
    } catch (error) {
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
        <NavigationBar />
        <Routes>
          <Route path="/" element={<PeerAssessment />} />
          <Route 
            path="/instructor-dashboard" 
            element={
              <PrivateRoute>
                <InstructorDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/instructor-dashboard/groups" 
            element={
              <PrivateRoute>
                <GroupManagement />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/instructor-dashboard/peer-assessments/detailed/:groupId" 
            element={
              <PrivateRoute>
                <DetailedView />
              </PrivateRoute>
            }
          />
          <Route 
            path="/instructor-dashboard/peer-assessments/summary" 
            element={
              <PrivateRoute>
                <SummaryView />
              </PrivateRoute>
            }
          />
          <Route 
            path="/student-page" 
            element={
              <PrivateRoute>
                <StudentPage />
              </PrivateRoute>
            }
          />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/peer-assessment/:groupId" element={<PeerAssessmentPage />} />
          <Route path="/instructor-dashboard/students" element={<ListOfStudentsPage />} />
          <Route 
            path="/instructor-dashboard/peer-assessments/detailed" 
            element={
              <PrivateRoute>
                <DetailedView />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
