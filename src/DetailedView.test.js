import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DetailedView from './DetailedView';

// Mocking fetch API
global.fetch = jest.fn((url) => {
  if (url.includes('/api/groups')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { _id: '1', name: 'Group A', participants: ['101'] },
          { _id: '2', name: 'Group B', participants: [] },
        ]),
    });
  }
  if (url.includes('/api/users')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([{ studentId: '101', name: 'Student A' }]),
    });
  }
  if (url.includes('/api/assessments')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            groupName: 'Group A',
            assessorId: '201',
            createdAt: '2023-11-01T12:00:00Z',
            ratings: [
              {
                memberId: '101',
                cooperation: 5,
                conceptual: 4,
                practical: 3,
                workEthic: 4,
                comment: 'Great job!',
              },
            ],
          },
        ]),
    });
  }
  return Promise.reject(new Error('Invalid URL'));
});

describe('DetailedView Component', () => {
  test('renders groups with and without assessments', async () => {
    await act(async () => {
      render(
        <Router>
          <DetailedView />
        </Router>
      );
    });

    // Check for the main heading
    expect(screen.getByText(/Peer Assessments - Detailed View/i)).toBeInTheDocument();

    // Check for groups
    expect(screen.getByText(/Group A/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Participants: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Group B/i)).toBeInTheDocument();
    expect(screen.getByText(/No assessments available for this group./i)).toBeInTheDocument();

    // Check for assessment details
    expect(screen.getByText(/Student ID \(Being Assessed\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Great job!/i)).toBeInTheDocument();
  });
});
