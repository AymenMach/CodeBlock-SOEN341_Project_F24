import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GroupManagement from './GroupManagement';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

global.fetch = jest.fn((url) => {
  if (url.includes('/add-participant')) {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ _id: '1', participants: ['123'] }) });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve([{ _id: '1', name: 'Group A', participants: [] }]) });
});

describe('GroupManagement - Add Participant', () => {
  test('renders add participant dropdown', async () => {
    render(<GroupManagement />);
    expect(await screen.findByText(/Add a participant/i)).toBeInTheDocument();
  });

  test('adds a participant to a group', async () => {
    render(<GroupManagement />);

    fireEvent.click(await screen.findByText(/Add a participant/i));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '123' } });
    fireEvent.click(screen.getByText(/Add/i));

    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/groups/add-participant', expect.any(Object));
    expect(await screen.findByText('Student added to the group successfully!')).toBeInTheDocument();
  });
});
