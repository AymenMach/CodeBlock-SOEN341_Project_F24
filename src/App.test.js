import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { UserProvider } from './UserContext';
import App from './App';

test('renders the Peer Assessment System header', () => {
  render(<App />);
});
