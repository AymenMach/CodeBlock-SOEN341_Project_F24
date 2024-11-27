import React from 'react';
import { render, screen } from '@testing-library/react';
import GroupManagement from './GroupManagement';

// Mock `react-router-dom` to prevent navigation errors
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock `fetch` to return minimal necessary data
global.fetch = jest.fn((url) => {
  if (url.includes('/api/groups')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ _id: '1', name: 'Group A', participants: [] }]),
    });
  }
  if (url.includes('/api/users')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ _id: '123', studentId: 'user123', name: 'User 123' }]),
    });
  }
  return Promise.reject(new Error('Unexpected API call'));
});

describe('GroupManagement Component', () => {
  test('renders the component with group and user data', async () => {
    render(<GroupManagement />);

    // Verify loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for groups to be fetched and displayed
    const groupElement = await screen.findByText(/Group A/i);
    expect(groupElement).toBeInTheDocument();

    // Verify Create Group form exists
    expect(screen.getByText(/Create a new group/i)).toBeInTheDocument();
  });
});
