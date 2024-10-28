import React, { useState, useEffect } from 'react';

  const PeerAssessmentForm = ({ groupId }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [cooperationScore, setCooperationScore] = useState(3); // Default score

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/groups/${groupId}`);
        const data = await response.json();
        setStudents(data.students);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [groupId]);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evaluatedStudent: selectedStudent,
          cooperationScore
        })
      });

      if (response.ok) {
        alert('Assessment submitted successfully!');
        setSelectedStudent(null);
        setCooperationScore(3);
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
    }
  };

  return (
    <div>
      <h2>Select a Teammate for Evaluation</h2>
      <select onChange={(e) => setSelectedStudent(e.target.value)} value={selectedStudent || ''}>
        <option value="" disabled>Select a teammate</option>
        {students.map(student => (
          <option key={student._id} value={student._id}>{student.username}</option>
        ))}
      </select>

      {selectedStudent && (
        <div>
          <h3>Rate Cooperation (1-5)</h3>
          <input type="number" min="1" max="5" value={cooperationScore} onChange={(e) => setCooperationScore(Number(e.target.value))} />
          <button onClick={handleSubmit}>Submit Assessment</button>
        </div>
      )}
    </div>
  );
};

export default PeerAssessmentForm;
