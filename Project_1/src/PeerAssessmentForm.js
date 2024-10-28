// PeerAssessmentForm.js
import React, { useState, useEffect } from 'react';

const PeerAssessmentForm = ({ groupId }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

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
        <button onClick={() => console.log("Start Evaluation", selectedStudent)}>Start Evaluation</button>
      )}
    </div>
  );
};

export default PeerAssessmentForm;
