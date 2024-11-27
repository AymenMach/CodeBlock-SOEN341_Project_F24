import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GroupManagement from './GroupManagement';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

global.fetch = jest.fn((url) => {
  if (url.includes('/remove-participant')) {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ _id: '1', participants: [] }) });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve([{ _id: '1', name: 'Group A', participants: ['123'] }]) });
});

describe('GroupManagement - Remove Participant', () => {
  test('removes a participant from a group', async () => {
    render(<GroupManagement />);

    fireEvent.click(await screen.findByText(/Remove/i));

    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/groups/remove-participant', expect.any(Object));
    expect(await screen.findByText('Remove')).toBeInTheDocument();
  });
});
