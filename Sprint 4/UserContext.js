import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.role === 'student') {
      const fetchStudentData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/users/${currentUser._id}`);
          const data = await response.json();
          if (response.ok) {
            setCurrentUser(prevUser => ({
              ...prevUser,
              name: data.name,
            }));
          } else {
            console.error('Failed to fetch student data', data);
          }
        } catch (error) {
          console.error('Error fetching student data:', error);
        }
      };

      if (!currentUser.name) {
        fetchStudentData();
      }
    }
  }, [currentUser]);

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
