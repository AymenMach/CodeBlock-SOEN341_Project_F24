import React from 'react';
import DisplayGroups from './DisplayGroups';
import './StudentDashboard.css';

const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
    <h1>Welcome to Your Dashboard</h1>
    <p>Here are the groups</p>
    <DisplayGroups />
  </div>
  );
};

export default StudentDashboard;
