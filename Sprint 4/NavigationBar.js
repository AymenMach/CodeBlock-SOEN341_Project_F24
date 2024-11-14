import React from 'react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = () => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      {currentUser && (
        <>
          {currentUser.role === 'student' ? (
            <>
              <span className="navbar-welcome">{currentUser.name} Student ID: {currentUser._id}</span>
            </>
          ) : (
            <>
              <span className="navbar-welcome">{currentUser.name}</span>
            </>
          )}
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default NavigationBar;
