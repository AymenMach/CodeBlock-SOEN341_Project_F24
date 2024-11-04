import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import RegistrationPage from './RegistrationPage';
import PeerAssessmentPage from './PeerAssessmentPage';
import StudentPage from './StudentPage';
import GroupManagement from './GroupManagement';

// User Context Setup
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (currentUser) {
      console.log('Current User:', currentUser);
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

const PeerAssessment = () => {
  const { setCurrentUser } = useUser();
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
      // Determine the appropriate endpoint based on role
      const endpoint = isInstructor ? 'http://localhost:5000/api/instructors/login' : 'http://localhost:5000/api/users/login';
      
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
      console.log('Login successful:', data);

      // Set the current user in context
      setCurrentUser(data);

      // Role checking logic
      if (isInstructor) {
        navigate('/instructor-page');
      } else if (isStudent) {
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
        {isStudent && (
          <button onClick={() => navigate('/register')}>Register</button>
        )}
      </div>
    </div>
  );
};

const InstructorPage = () => <GroupManagement isInstructor={true} />;

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
