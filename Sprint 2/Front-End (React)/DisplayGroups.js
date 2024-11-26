import React, { useEffect, useState } from 'react';
import './DisplayGroups.css';

const DisplayGroups = ({ role }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const endpoint = role === 'instructor' ? '/api/groups' : '/api/groups/student';
        const response = await fetch(endpoint);
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [role]);

  return (
    <div className="display-groups">
      {loading ? <div>Loading...</div> : groups.map(/* Display logic */)}
    </div>
  );
};

export default DisplayGroups;
