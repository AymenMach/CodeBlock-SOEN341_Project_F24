import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { UserProvider } from './UserContext';
import App from './App';

test('renders the Peer Assessment System header', () => {
  render(
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  );

  // Check if the header text is present
  const headerElement = screen.getByText(/PEER ASSESSMENT SYSTEM/i);
  expect(headerElement).toBeInTheDocument();
});
