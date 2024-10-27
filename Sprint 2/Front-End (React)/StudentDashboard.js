import React from 'react';
import DisplayGroups from './DisplayGroups';
import './StudentDashboard.css';

const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
      <h1>Your Groups</h1>
      <p>List of groups you are a part of:</p>
      <div className="group-list">
        <div className="group">
          <h2>Group A</h2>
          <ul>
            <li>Alice</li>
            <li>Bob</li>
          </ul>
        </div>
        <div className="group">
          <h2>Group B</h2>
          <ul>
            <li>Charlie</li>
            <li>Dave</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
