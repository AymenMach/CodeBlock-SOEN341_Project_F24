import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GroupManagement from './GroupManagement';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ _id: '1', name: 'New Group', participants: [] }),
  })
);

describe('GroupManagement - Create Group', () => {
  test('renders group creation form', () => {
    render(<GroupManagement />);
    expect(screen.getByText(/Create a new group/i)).toBeInTheDocument();
  });

  test('creates a new group on button click', async () => {
    render(<GroupManagement />);

    fireEvent.change(screen.getByLabelText(/Group name:/i), {
      target: { value: 'New Group' },
    });
    fireEvent.click(screen.getByText(/Create a new group/i));

    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/groups/create', expect.any(Object));
    expect(await screen.findByText('Group created successfully!')).toBeInTheDocument();
  });
});
