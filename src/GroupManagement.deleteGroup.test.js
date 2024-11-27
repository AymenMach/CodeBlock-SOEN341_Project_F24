import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GroupManagement from './GroupManagement';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

global.fetch = jest.fn((url) => {
  if (url.includes('/api/groups/1')) {
    return Promise.resolve({ ok: true });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve([{ _id: '1', name: 'Group A', participants: [] }]) });
});

describe('GroupManagement - Delete Group', () => {
  test('deletes a group', async () => {
    render(<GroupManagement />);

    fireEvent.click(await screen.findByText(/Delete Group/i));
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/groups/1', { method: 'DELETE' });
  });
});
