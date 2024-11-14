import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListOfStudentsPage.css';

const ListOfStudentsPage = () => {
  const [users, setUsers] = useState([]);
  const [sortOrderName, setSortOrderName] = useState('asc');
  const [sortOrderId, setSortOrderId] = useState('asc');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleSortByName = (order) => {
    const sortedUsers = [...users].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return order === 'asc' ? comparison : -comparison;
    });
    setUsers(sortedUsers);
  };

  const handleSortById = (order) => {
    const sortedUsers = [...users].sort((a, b) => {
      const comparison = a.studentId - b.studentId;
      return order === 'asc' ? comparison : -comparison;
    });
    setUsers(sortedUsers);
  };

  const handleSortOrderNameChange = (e) => {
    setSortOrderName(e.target.value);
    handleSortByName(e.target.value);
  };

  const handleSortOrderIdChange = (e) => {
    setSortOrderId(e.target.value);
    handleSortById(e.target.value);
  };

  return (
    <div className="list-of-students-container">
      <h1>List of All Students</h1>
      <div>
        <button className="custom-button" onClick={() => navigate(-1)}>
          Back
        </button>
        <button className="custom-button" onClick={handleRefresh}>
          Refresh
        </button>
        <select className="custom-dropdown" value={sortOrderName} onChange={handleSortOrderNameChange}>
          <option value="asc">Sort by Name (A-Z)</option>
          <option value="desc">Sort by Name (Z-A)</option>
        </select>
        <select className="custom-dropdown" value={sortOrderId} onChange={handleSortOrderIdChange}>
          <option value="asc">Sort by ID (Ascending)</option>
          <option value="desc">Sort by ID (Descending)</option>
        </select>
      </div>

      {users.length === 0 ? (
        <p>No students found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.studentId}</td>
                <td>{user.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListOfStudentsPage;
