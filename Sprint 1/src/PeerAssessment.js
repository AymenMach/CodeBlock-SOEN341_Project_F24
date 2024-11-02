import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PeerAssessment = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [teammates, setTeammates] = useState([]);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    // Fetch teammates for the group
    const fetchTeammates = async () => {
      const response = await fetch('/api/groups/${groupId}');
      const data = await response.json();
      setTeammates(data.participants); 
      );
      fetchTeammates();
    }; [groupId];

    const handleRatingChange = (teammate, value) => {
      setRatings({ ...ratings, [teammate]: value });
    };

    const handleSubmit = async () => {
      await fetch('/api/peer-assessment/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ groupId, ratings}),
      });
      navigate('/student-page');
    };


    return (
    <div>
      <h2>Peer Assessment for Group {groupId}</h2>
      <table>
        {/* Table structure */}
      </table>
      <button onClick={handleSubmit}>Submit Assessment</button>
    </div>
  );
}

export default PeerAssessment;
      
