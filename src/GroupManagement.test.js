import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import GroupManagement from './GroupManagement';

describe('GroupManagement Component', () => {
  test('renders the Group Management header', () => {
    render(
      <Router>
        <GroupManagement />
      </Router>
    );

    // Check for header text
    expect(screen.getByText(/Group Management/i)).toBeInTheDocument();
  });

  test('navigates back to the instructor dashboard', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

    render(
      <Router>
        <GroupManagement />
      </Router>
    );

    const backButton = screen.getByText(/Return to Instructor Dashboard/i);
    fireEvent.click(backButton);

    // Check if navigation was triggered
    expect(mockNavigate).toHaveBeenCalledWith('/instructor-dashboard');
  });
});
