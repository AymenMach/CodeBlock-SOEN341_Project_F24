import React, { useEffect, useState } from 'react';
import './DisplayGroups.css';

const DisplayGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/groups');
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return <div className="display-groups">Loading...</div>;
  }

  return (
    <div className="display-groups">
      <h2>Group List</h2>
      <div className="group-list">
        {groups.map((group) => (
          <div key={group.id} className="group-item">
            <div className="group-name">{group.name}</div>
            <ul>
              {group.participants.map((participant, index) => (
                <li key={index}>{participant}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayGroups;
