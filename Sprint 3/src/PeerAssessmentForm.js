import React, { useState, useEffect } from 'react';

// PeerAssessmentForm.js (continued for dimensions)
const [conceptualScore, setConceptualScore] = useState(3);
const [practicalScore, setPracticalScore] = useState(3);
const [workEthicScore, setWorkEthicScore] = useState(3);
const [conceptualComment, setConceptualComment] = useState('');
const [practicalComment, setPracticalComment] = useState('');
const [workEthicComment, setWorkEthicComment] = useState('');

const handleSubmit = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        evaluatedStudent: selectedStudent, cooperationScore, conceptualScore, practicalScore, workEthicScore, conceptualComment, practicalComment, workEthicComment
      })
    });

    if (response.ok) {
      alert('Assessment submitted successfully!');
      setSelectedStudent(null);
      setCooperationScore(3);
      setConceptualScore(3);
      setPracticalScore(3);
      setWorkEthicScore(3);
      setConceptualComment('');
      setPracticalComment('');
      setWorkEthicComment('');
    }
  } catch (error) {
    console.error('Error submitting assessment:', error);
  }
};
