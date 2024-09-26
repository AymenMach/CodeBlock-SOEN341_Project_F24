


import React, { useState } from 'react';
import './App.css'; 

const PeerAssessment = () => {
  const [isStudent, setIsStudent] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleStudentChange = () => {
    setIsStudent(!isStudent);
    if (isInstructor) setIsInstructor(false);
  };

  const handleInstructorChange = () => {
    setIsInstructor(!isInstructor);
    if (isStudent) setIsStudent(false);
  };

  const handleSubmit = () => {
    // Handle the submit action here
    console.log('Submitted:', { username, password, isStudent, isInstructor });
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

export default PeerAssessment;
