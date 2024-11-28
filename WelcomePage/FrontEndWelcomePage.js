import React, { useState } from 'react'; // Importing React and the useState hook for state management
import './App.css'; // Importing the CSS file for styling

// Main functional component for the Peer Assessment system
const PeerAssessment = () => {
  // State variables to track user role (student or instructor) and login credentials
  const [isStudent, setIsStudent] = useState(false); // Boolean to determine if the user is a student
  const [isInstructor, setIsInstructor] = useState(false); // Boolean to determine if the user is an instructor
  const [username, setUsername] = useState(''); // Stores the entered username
  const [password, setPassword] = useState(''); // Stores the entered password

  // Toggles the "Student" checkbox and ensures the "Instructor" checkbox is deselected
  const handleStudentChange = () => {
    setIsStudent(!isStudent); // Toggle the student state
    if (isInstructor) setIsInstructor(false); // If instructor is selected, deselect it
  };

  // Toggles the "Instructor" checkbox and ensures the "Student" checkbox is deselected
  const handleInstructorChange = () => {
    setIsInstructor(!isInstructor); // Toggle the instructor state
    if (isStudent) setIsStudent(false); // If student is selected, deselect it
  };

  // Handles the submit action (e.g., logging the entered data for now)
  const handleSubmit = () => {
    // Log the entered data for debugging or processing
    console.log('Submitted:', { username, password, isStudent, isInstructor });
  };

  // Render the component UI
  return (
    <div className="peer-assessment">
      {/* Concordia University logo */}
      <img
        src="https://crypto.quebec/wp-content/uploads/2016/03/concordia.jpg"
        alt="Concordia University Logo"
        className="logo concordia-logo"
      />
      
      <div className="content">
        {/* Main heading */}
        <h1>PEER ASSESSMENT SYSTEM</h1>

        {/* Checkbox group for selecting user role */}
        <div className="checkbox-group">
          <label>Are you a(n):</label>
          <label>
            <input
              type="checkbox"
              checked={isStudent} // Controlled checkbox for "Student"
              onChange={handleStudentChange} // Handle student selection
            />
            Student
          </label>
          <label>
            <input
              type="checkbox"
              checked={isInstructor} // Controlled checkbox for "Instructor"
              onChange={handleInstructorChange} // Handle instructor selection
            />
            Instructor
          </label>
        </div>

        {/* Show credentials input fields if either role is selected */}
        {(isStudent || isInstructor) && (
          <div className="credentials">
            <input
              type="text"
              placeholder="Username" // Placeholder text for username
              value={username} // Controlled input for username
              onChange={(e) => setUsername(e.target.value)} // Update username state on change
            />
            <input
              type="password"
              placeholder="Password" // Placeholder text for password
              value={password} // Controlled input for password
              onChange={(e) => setPassword(e.target.value)} // Update password state on change
            />
            <button onClick={handleSubmit}>Enter</button> {/* Submit button */}
          </div>
        )}
      </div>
    </div>
  );
};

export default PeerAssessment; // Export the component for use in other parts of the application


