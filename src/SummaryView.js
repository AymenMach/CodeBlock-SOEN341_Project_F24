import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SummaryView = () => {
  const [users, setUsers] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('highestAverage');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch('http://localhost:5000/api/users');
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }
        const usersData = await usersResponse.json();

        const assessmentsResponse = await fetch('http://localhost:5000/api/assessments');
        if (!assessmentsResponse.ok) {
          throw new Error('Failed to fetch assessments');
        }
        const assessmentsData = await assessmentsResponse.json();

        setUsers(usersData);
        setAssessments(assessmentsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching data.');
      }
    };

    fetchData();
  }, []);

  const handleBackClick = () => {
    navigate('/instructor-dashboard');
  };

  const getUserByStudentId = (studentId) => {
    return users.find((user) => user.studentId === studentId);
  };

  const calculateAveragesForStudent = (peerAssessments) => {
    const totals = {
      cooperation: 0,
      conceptual: 0,
      practical: 0,
      workEthic: 0,
    };

    peerAssessments.forEach((assessment) => {
      if (typeof assessment.cooperation === 'number') totals.cooperation += assessment.cooperation;
      if (typeof assessment.conceptual === 'number') totals.conceptual += assessment.conceptual;
      if (typeof assessment.practical === 'number') totals.practical += assessment.practical;
      if (typeof assessment.workEthic === 'number') totals.workEthic += assessment.workEthic;
    });

    const numResponses = peerAssessments.length;

    if (numResponses === 0) return { averages: totals, overallAverage: '-' };

    const averages = {
      cooperation: (totals.cooperation / numResponses).toFixed(2),
      conceptual: (totals.conceptual / numResponses).toFixed(2),
      practical: (totals.practical / numResponses).toFixed(2),
      workEthic: (totals.workEthic / numResponses).toFixed(2),
    };

    const overallAverage =
      (
        (parseFloat(averages.cooperation) +
          parseFloat(averages.conceptual) +
          parseFloat(averages.practical) +
          parseFloat(averages.workEthic)) /
        4
      ).toFixed(2);

    return { averages, overallAverage, numResponses };
  };

  const prepareTableData = () => {
    const studentAssessments = [];

    assessments.forEach((assessment) => {
      assessment.ratings.forEach((rating) => {
        const existingStudent = studentAssessments.find(
          (student) => student.studentId === rating.memberId
        );

        if (!existingStudent) {
          studentAssessments.push({
            studentId: rating.memberId,
            peerAssessments: [rating],
          });
        } else {
          existingStudent.peerAssessments.push(rating);
        }
      });
    });

    return studentAssessments.map((student) => {
      const { averages, overallAverage, numResponses } = calculateAveragesForStudent(student.peerAssessments);
      const studentInfo = getUserByStudentId(Number(student.studentId));

      return {
        studentId: student.studentId,
        name: studentInfo ? studentInfo.name : 'Unknown',
        cooperation: averages.cooperation || '-',
        conceptual: averages.conceptual || '-',
        practical: averages.practical || '-',
        workEthic: averages.workEthic || '-',
        averageRating: overallAverage || '-',
        peersWhoResponded: numResponses || '-',
      };
    });
  };

  const sortedTableData = () => {
    const data = prepareTableData();
    if (sortOption === 'highestAverage') {
      return data.sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating));
    }
    if (sortOption === 'lowestAverage') {
      return data.sort((a, b) => parseFloat(a.averageRating) - parseFloat(b.averageRating));
    }
    return data;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const tableData = sortedTableData();

  return (
    <div className="summary-view">
      <h1>Summary View</h1>

      <button onClick={handleBackClick} className="back-button">
        Back to Dashboard
      </button>

      <div className="sort-options">
        <label htmlFor="sort">Sort by: </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="highestAverage">Highest Average</option>
          <option value="lowestAverage">Lowest Average</option>
        </select>
      </div>

      {tableData.length > 0 ? (
        <table className="summary-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Cooperation</th>
              <th>Conceptual Contribution</th>
              <th>Practical Contribution</th>
              <th>Work Ethic</th>
              <th>Average</th>
              <th>Peers Who Responded</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((participant, index) => (
              <tr key={index}>
                <td>{participant.studentId}</td>
                <td>{participant.name}</td>
                <td>{participant.cooperation}</td>
                <td>{participant.conceptual}</td>
                <td>{participant.practical}</td>
                <td>{participant.workEthic}</td>
                <td>{participant.averageRating}</td>
                <td>{participant.peersWhoResponded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No assessments available.</p>
      )}
    </div>
  );
};

export default SummaryView;
