import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DetailedView = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupsResponse = await fetch('http://localhost:5000/api/groups');
        if (!groupsResponse.ok) {
          throw new Error('Failed to fetch groups');
        }
        const groupsData = await groupsResponse.json();

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

        setGroups(groupsData);
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

  const getAssessmentForGroup = (groupName) => {
    return assessments.filter(assessment => assessment.groupName === groupName);
  };

  const getPeerAssessmentsForMember = (memberId) => {
    const peerAssessments = [];
    assessments.forEach(assessment => {
      assessment.ratings.forEach(rating => {
        if (rating.memberId === memberId) {
          peerAssessments.push({
            assessorId: assessment.assessorId,
            createdAt: assessment.createdAt,
            cooperation: rating.cooperation,
            conceptual: rating.conceptual,
            practical: rating.practical,
            workEthic: rating.workEthic,
            comment: rating.comment || "NONE",
          });
        }
      });
    });
    return peerAssessments;
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleBackClick = () => {
    navigate('/instructor-dashboard');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const groupsWithAssessments = groups.filter(group => getAssessmentForGroup(group.name).length > 0);
  const groupsWithoutAssessments = groups.filter(group => getAssessmentForGroup(group.name).length === 0);

  return (
    <div className="detailed-view">
      <h1>Peer Assessments - Detailed View</h1>

      <button onClick={handleBackClick} className="back-button">
        Back to Dashboard
      </button>

      <div>
        {groupsWithAssessments.length > 0 && (
          <div>
            <h2>Groups with Assessments</h2>
            {groupsWithAssessments.map(group => {
              const groupAssessments = getAssessmentForGroup(group.name);

              return (
                <div key={group._id} className="group">
                  <h3>{group.name} (Total Participants: {group.participants.length})</h3>

                  {groupAssessments.length > 0 && (
                    <div>
                      <h4>Assessments for this Group:</h4>
                      {groupAssessments.map((assessment, index) => (
                        <div key={index} className="assessment">
                          <table>
                            <thead>
                              <tr>
                                <th>Student ID (Being Assessed)</th>
                                <th>Assessor ID</th>
                                <th>Created Date</th>
                                <th>Cooperation</th>
                                <th>Conceptual</th>
                                <th>Practical</th>
                                <th>Work Ethic</th>
                                <th>Comment</th>
                              </tr>
                            </thead>
                            <tbody>
                            {assessment.ratings.map((rating, index) => (
                              <tr key={index}>
                                <td>{rating.memberId}</td>
                                <td>{assessment.assessorId}</td>
                                <td>{formatDate(assessment.createdAt)}</td>
                                <td>{rating.cooperation}</td>
                                <td>{rating.conceptual}</td>
                                <td>{rating.practical}</td>
                                <td>{rating.workEthic}</td>
                                <td>
                                  <ul>
                                    <li><strong>Cooperation:</strong> {rating.feedback.cooperation || "NONE"}</li>
                                    <li><strong>Conceptual:</strong> {rating.feedback.conceptual || "NONE"}</li>
                                    <li><strong>Practical:</strong> {rating.feedback.practical || "NONE"}</li>
                                    <li><strong>Work Ethic:</strong> {rating.feedback.workEthic || "NONE"}</li>
                                  </ul>
                                </td>
                              </tr>
                            ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  )}

                  {group.participants.map(memberId => {
                    const member = users.find(u => u.studentId === memberId);
                    if (!member) {
                      return null;
                    }

                    const peerAssessments = getPeerAssessmentsForMember(memberId);

                    if (peerAssessments.length === 0) {
                      return null;
                    }

                    return (
                      <div key={memberId} className="member-assessments">
                        <h4>{memberId}</h4>

                        <table>
                          <thead>
                            <tr>
                              <th>Assessor ID</th>
                              <th>Created Date</th>
                              <th>Cooperation</th>
                              <th>Conceptual</th>
                              <th>Practical</th>
                              <th>Work Ethic</th>
                              <th>Comment</th>
                            </tr>
                          </thead>
                          <tbody>
                            {peerAssessments.map((assessment, index) => (
                              <tr key={index}>
                                <td>{assessment.assessorId}</td>
                                <td>{formatDate(assessment.createdAt)}</td>
                                <td>{assessment.cooperation}</td>
                                <td>{assessment.conceptual}</td>
                                <td>{assessment.practical}</td>
                                <td>{assessment.workEthic}</td>
                                <td>{assessment.comment || "NONE"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {groupsWithoutAssessments.length > 0 && (
          <div>
            <h2>Groups without Assessments</h2>
            {groupsWithoutAssessments.map(group => (
              <div key={group._id} className="group">
                <h3>{group.name} (Total Participants: {group.participants.length})</h3>
                <p>No assessments available for this group.</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedView;
