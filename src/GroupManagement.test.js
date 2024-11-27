import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import GroupManagement from './GroupManagement';

global.fetch = jest.fn();

describe('GroupManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the Group Management header', () => {
    render(
      <Router>
        <GroupManagement />
      </Router>
    );
    expect(screen.getByText(/Group Management/i)).toBeInTheDocument();
  });

  test('renders loading state for groups and users', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <Router>
        <GroupManagement />
      </Router>
    );

    expect(fetch).toHaveBeenCalledTimes(2); // Groups and users fetch calls
  });

  test('creates a new group', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    }); // Mock fetch for groups
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    }); // Mock fetch for users
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: 'New Group', _id: '1', participants: [] }),
    }); // Mock fetch for create group

    render(
      <Router>
        <GroupManagement />
      </Router>
    );

    const groupNameInput = screen.getByLabelText(/Group name:/i);
    const createGroupButton = screen.getByText(/Create a new group/i);

    fireEvent.change(groupNameInput, { target: { value: 'New Group' } });
    fireEvent.click(createGroupButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/groups/create', expect.any(Object));
      expect(screen.getByText(/New Group/i)).toBeInTheDocument();
    });
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

    expect(mockNavigate).toHaveBeenCalledWith('/instructor-dashboard');
  });
});
