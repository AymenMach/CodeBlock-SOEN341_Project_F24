import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, username, password }),
      });

      const text = await response.text();
      console.log('Raw response:', text);

      if (!response.ok) {

        try {
          const errorData = JSON.parse(text);
          alert(errorData?.message || 'Registration failed');
        } catch (jsonError) {
          alert('Registration failed: ' + text);
        }
        return;
      }


      alert('Registration successful!');
      navigate('/');
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <div className="registration-page">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationPage;
