import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css'; 

// start of welcome page
const PeerAssessment = () => {
  console.log('Rendering PeerAssessment');
  const [isStudent, setIsStudent] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleStudentChange = () => {
    setIsStudent(!isStudent);
    if (isInstructor) setIsInstructor(false);
  };

  const handleInstructorChange = () => {
    setIsInstructor(!isInstructor);
    if (isStudent) setIsStudent(false);
  };

  const fetchgroups = async () =>  {
    const response = await fetch('/api/groups');
    return await response.json();
  };

  return (
    <div className="peer-assessment">
      <img src="https://crypto.quebec/wp-content/uploads/2016/03/concordia.jpg" alt="Concordia University Logo" className="logo concordia-logo" />
      <div className="content">
        <h1>PEER ASSESSMENT SYSTEM</h1>
        <div className="checkbox-group">
          <label>
            Are you a(n):
          </label>
          <label>
            <input
              type="checkbox"
              checked={isStudent}
              onChange={handleStudentChange}
            />
            Student
          </label>
          <label>
            <input
              type="checkbox"
              checked={isInstructor}
              onChange={handleInstructorChange}
            />
            Instructor
          </label>
        </div>
        {(isStudent || isInstructor) && (
          <div className="credentials">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSubmit}>Enter</button>
          </div>
        )}
      </div>
    </div>
  );
};
// end of welcome page

// start of instructor page
const GroupManagement = () => {
  console.log('Rendering GroupManagement');
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateGroup = () => {
    const newGroup = {
      name: newGroupName,
      participants: [],
    };
    setGroups([...groups, newGroup]);
    setNewGroupName('');
  };

  const handleAddParticipant = (groupIndex) => {
    const participantName = prompt('Enter participant name:');
    if (participantName) {
      const updatedGroups = [...groups];
      updatedGroups[groupIndex].participants.push(participantName);
      setGroups(updatedGroups);
    }
  };

  const groupPage = ({ isInstructor }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const getGroups = async () => {
    const groupData = await fetchGroups();
    setGroups(groupsData);
    };
    getGroups();
  }, []);

    const createGroup = async (groupName) => {
  const response = await fetch('/api/groups/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ groupName }),
  });
  if (response.ok) {
    fetchGroups();
  }
};

const assignStudent = async (groupId, studentId) => {
  const response = await fetch('/api/groups/assign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ groupId, studentId }),
  });
  if (response.ok) {
    fetchGroups();
  }
};

  return (
    <div>
      <h1>Groups</h1>
      {groups.map(group => (
        <div key={group._id}>
          <h2>{group.name}</h2>
          <ul>
            {group.students.map(student => (
              <li key={student._id}>{student.username}</li>
            ))}
          </ul>
        </div>
      ))}
      {isInstructor && (
        <>
          <button onClick={/* Create Group Logic */}>Create Group</button>
          <button onClick={/* Assign Students Logic */}>Assign Students</button>
        </>
      )}
    </div>
  );
};
// end of instructor page

// start of student page
const StudentPage = () => {
  console.log('Rendering StudentPage');
  
  const GroupsPage = ({ isInstructor }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const getGroups = async () => {
    const groupsData = await fetchGroups();
    setGroups(groupsData);
    };
    getGroups();
  }, []);
  
    return (
    <div>
      <h1>Groups</h1>
      {groups.map(group => (
        <div key={group._id}>
          <h2>{group.name}</h2>
          <ul>
            {group.students.map(student => (
              <li key={student._id}>{student.username}</li>
            ))}
          </ul>
        </div>
      ))}
      {isInstructor && (
        <>
          <button onClick={/* Create Group Logic */}>Create Group</button>
          <button onClick={/* Assign Students Logic */}>Assign Students</button>
        </>
      )}
    </div>
  );
};

// end of student page
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PeerAssessment />} />
        <Route path="/instructor-page" element={<GroupManagement />} />
        <Route path="/student-page" element={<StudentPage />} />
      </Routes>
    </Router>
  );
};

const StudentPage = () => <GroupPage isInstructor={false} />;
const InstructorPage = () => <GroupPage isInstructor={true} />;

export { StudentPage, InstructorPage };
